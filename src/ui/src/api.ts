export interface FeatureFlag {
    id: string
    name: string
    description: string
    environment: string
    isEnabled: boolean
    rolloutPercentage: number
    createdAt: string
}

export interface AuditEntry {
    id: string
    timestamp: string
    changeSummary: string
}

const BASE = '/api';

export const getFlags = (): Promise<FeatureFlag[]> =>
    fetch(`${BASE}/flags`).then(r => r.json());

export const getFlag = (id: string): Promise<FeatureFlag> =>
    fetch(`${BASE}/flags/${id}`).then(r => r.json());

export const createFlag = (flag: { name: string; description: string; environment: string }): Promise<FeatureFlag> =>
    fetch(`${BASE}/flags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flag)
    }).then(r => r.json());

export const toggleFlag = (id: string): Promise<Response> =>
    fetch(`${BASE}/flags/${id}/toggle`, { method: 'POST' });

export const setRollout = (id: string, percentage: number): Promise<Response> =>
    fetch(`${BASE}/flags/${id}/rollout`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ percentage })
    });

export const deleteFlag = (id: string): Promise<Response> =>
    fetch(`${BASE}/flags/${id}`, { method: 'DELETE' });

export const getAuditLog = (id: string): Promise<AuditEntry[]> =>
    fetch(`${BASE}/flags/${id}/audit`).then(r => r.json());
