import { useState } from 'react'
import FlagList from './components/FlagList'
import FlagDetail from './components/FlagDetail'

export default function App() {
    const [selectedFlagId, setSelectedFlagId] = useState<string | null>(null)

    return (
        <div style={{ fontFamily: 'sans-serif', maxWidth: 960, margin: '0 auto', padding: 24 }}>
            <h1 style={{ marginBottom: 24 }}>Feature Flags</h1>
            <div style={{
                display: 'grid',
                gridTemplateColumns: selectedFlagId ? '1fr 1fr' : '1fr',
                gap: 24,
                alignItems: 'start'
            }}>
                <FlagList onSelect={setSelectedFlagId} selectedId={selectedFlagId} />
                {selectedFlagId && (
                    <FlagDetail flagId={selectedFlagId} onClose={() => setSelectedFlagId(null)} />
                )}
            </div>
        </div>
    )
}
