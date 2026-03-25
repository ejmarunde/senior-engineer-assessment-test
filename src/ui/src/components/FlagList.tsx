import { useState, useEffect } from 'react'
import * as api from '../api'
import type { FeatureFlag } from '../api'

interface FlagListProps {
    onSelect: (id: string | null) => void
    selectedId: string | null
}

export default function FlagList({ onSelect, selectedId }: FlagListProps) {
    const [flags, setFlags] = useState<FeatureFlag[]>([])
    const [filter, setFilter] = useState('all')
    const [loading, setLoading] = useState(true)
    const [showCreate, setShowCreate] = useState(false)
    const [newName, setNewName] = useState('')
    const [newDescription, setNewDescription] = useState('')
    const [newEnvironment, setNewEnvironment] = useState('production')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadFlags()
    }, [])

    async function loadFlags() {
        setLoading(true)
        try {
            const all = await api.getFlags()
            const filtered = filter === 'all'
                ? all
                : all.filter(f => f.isEnabled === (filter === 'enabled'))
            setFlags(filtered)
        } catch {
            setError('Failed to load flags.')
        } finally {
            setLoading(false)
        }
    }

    async function handleToggle(e: React.MouseEvent, id: string) {
        e.stopPropagation()
        await api.toggleFlag(id)
        setFlags(flags.map(f => f.id === id ? { ...f, isEnabled: !f.isEnabled } : f))
    }

    async function handleDelete(e: React.MouseEvent, id: string) {
        e.stopPropagation()
        await api.deleteFlag(id)
        setFlags(flags.filter(f => f.id !== id))
        if (selectedId === id) onSelect(null)
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault()
        const created = await api.createFlag({
            name: newName,
            description: newDescription,
            environment: newEnvironment
        })
        setFlags([...flags, created])
        setNewName('')
        setNewDescription('')
        setNewEnvironment('production')
        setShowCreate(false)
    }

    if (loading) return <p>Loading...</p>
    if (error) return <p style={{ color: 'red' }}>{error}</p>

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <select value={filter} onChange={e => setFilter(e.target.value)}>
                    <option value="all">All</option>
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled</option>
                </select>
                <button onClick={() => setShowCreate(!showCreate)}>+ New Flag</button>
            </div>

            {showCreate && (
                <form onSubmit={handleCreate} style={{ marginBottom: 16, padding: 12, border: '1px solid #ccc', borderRadius: 4 }}>
                    <div style={{ marginBottom: 8 }}>
                        <input
                            placeholder="Name *"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            required
                            style={{ width: '100%', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div style={{ marginBottom: 8 }}>
                        <input
                            placeholder="Description"
                            value={newDescription}
                            onChange={e => setNewDescription(e.target.value)}
                            style={{ width: '100%', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div style={{ marginBottom: 8 }}>
                        <select value={newEnvironment} onChange={e => setNewEnvironment(e.target.value)}>
                            <option value="production">Production</option>
                            <option value="staging">Staging</option>
                            <option value="development">Development</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button type="submit">Create</button>
                        <button type="button" onClick={() => setShowCreate(false)}>Cancel</button>
                    </div>
                </form>
            )}

            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {flags.map(flag => (
                    <li
                        key={flag.id}
                        onClick={() => onSelect(flag.id)}
                        style={{
                            padding: 12,
                            marginBottom: 8,
                            border: `1px solid ${selectedId === flag.id ? '#0070f3' : '#e0e0e0'}`,
                            borderRadius: 4,
                            cursor: 'pointer',
                            background: selectedId === flag.id ? '#f0f7ff' : 'white'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong>{flag.name}</strong>
                            <span style={{ fontSize: 12, color: flag.isEnabled ? 'green' : '#999' }}>
                                {flag.isEnabled ? `Enabled (${flag.rolloutPercentage}%)` : 'Disabled'}
                            </span>
                        </div>
                        <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{flag.description}</div>
                        <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{flag.environment}</div>
                        <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                            <button onClick={e => handleToggle(e, flag.id)}>
                                {flag.isEnabled ? 'Disable' : 'Enable'}
                            </button>
                            <button
                                onClick={e => handleDelete(e, flag.id)}
                                style={{ color: 'red' }}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {flags.length === 0 && <p style={{ color: '#999' }}>No flags found.</p>}
        </div>
    )
}
