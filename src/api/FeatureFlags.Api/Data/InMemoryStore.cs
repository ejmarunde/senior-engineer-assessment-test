namespace FeatureFlags.Api.Data;

using FeatureFlags.Api.Models;

public class InMemoryStore
{
    private readonly List<FeatureFlag> _flags = new();
    private readonly List<AuditEntry> _auditEntries = new();

    public List<FeatureFlag> Flags => _flags;
    public List<AuditEntry> AuditEntries => _auditEntries;
}
