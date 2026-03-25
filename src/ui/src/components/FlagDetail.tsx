import { useState, useEffect } from 'react'
import * as api from '../api'
import type { FeatureFlag, AuditEntry } from '../api'

interface FlagDetailProps {
    flagId: string
    onClose: () => void
}

export default function FlagDetail({ flagId, onClose }: FlagDetailProps) {
    const [flag, setFlag] = useState<FeatureFlag | null>(null)
    const [auditLog, setAuditLog] = useState<AuditEntry[]>([])
    const [rollout, setRollout] = useState<string | number>(0)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function load() {
            try {
                const [flagData, log] = await Promise.all([
                    api.getFlag(flagId),
                    api.getAuditLog(flagId)
                ])
                setFlag(flagData)
                setRollout(flagData.rolloutPercentage)
                setAuditLog(log)
            } catch {
                setError('Failed to load flag details.')
            }
        }
        load()
    }, [flagId])

    async function handleSaveRollout(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        try {
            await api.setRollout(flagId, Number(rollout))
            const updated = await api.getFlag(flagId)
            setFlag(updated)
            setRollout(updated.rolloutPercentage)
        } finally {
            setSaving(false)
        }
    }

    if (error) return <p style={{ color: 'red' }}>{error}</p>
    if (!flag) return <p>Loading...</p>

    return (
        <div style={{ padding: 16, border: '1px solid #e0e0e0', borderRadius: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h2 style={{ margin: 0 }}>{flag.name}</h2>
                <button onClick={onClose}>✕</button>
            </div>

            <p style={{ color: '#666', marginTop: 8 }}>{flag.description}</p>

            <table style={{ borderCollapse: 'collapse', marginBottom: 16, fontSize: 14 }}>
                <tbody>
                    <tr>
                        <td style={{ paddingRight: 16, color: '#999' }}>Environment</td>
                        <td>{flag.environment}</td>
                    </tr>
                    <tr>
                        <td style={{ paddingRight: 16, color: '#999' }}>Status</td>
                        <td style={{ color: flag.isEnabled ? 'green' : '#999' }}>
                            {flag.isEnabled ? 'Enabled' : 'Disabled'}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ paddingRight: 16, color: '#999' }}>Rollout</td>
                        <td>{flag.rolloutPercentage}%</td>
                    </tr>
                    <tr>
                        <td style={{ paddingRight: 16, color: '#999' }}>Created</td>
                        <td>{new Date(flag.createdAt).toLocaleString()}</td>
                    </tr>
                </tbody>
            </table>

            <form onSubmit={handleSaveRollout} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                <label style={{ fontSize: 14 }}>
                    Rollout %
                </label>
                <input
                    type="number"
                    min="0"
                    max="100"
                    value={rollout}
                    onChange={e => setRollout(e.target.value)}
                    style={{ width: 60 }}
                />
                <button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                </button>
            </form>

            <h3 style={{ marginBottom: 8 }}>Audit Log</h3>
            {auditLog.length === 0 ? (
                <p style={{ color: '#999', fontSize: 14 }}>No audit entries.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 13 }}>
                    {auditLog.map(entry => (
                        <li key={entry.id} style={{ padding: '6px 0', borderBottom: '1px solid #f0f0f0' }}>
                            <span style={{ color: '#aaa', marginRight: 8 }}>
                                {new Date(entry.timestamp).toLocaleString()}
                            </span>
                            {entry.changeSummary}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
