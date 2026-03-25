namespace FeatureFlags.Api.Services;

using FeatureFlags.Api.Data;
using FeatureFlags.Api.Models;

public class FeatureFlagService
{
    private readonly InMemoryStore _store;

    public FeatureFlagService(InMemoryStore store)
    {
        _store = store;
    }

    public IEnumerable<FeatureFlag> GetAll()
    {
        return _store.Flags.Where(f => f.DeletedAt == null);
    }

    public FeatureFlag? GetById(string id)
    {
        return _store.Flags.FirstOrDefault(f => f.Id == id && f.DeletedAt == null);
    }

    public FeatureFlag Create(string name, string description, string environment)
    {
        var flag = new FeatureFlag
        {
            Name = name,
            Description = description,
            Environment = environment,
            IsEnabled = false,
            RolloutPercentage = 0
        };

        _store.Flags.Add(flag);

        _store.AuditEntries.Add(new AuditEntry
        {
            FlagId = flag.Id,
            FlagName = flag.Name,
            Action = "created",
            ChangeSummary = $"Flag '{flag.Name}' created for environment '{flag.Environment}'"
        });

        return flag;
    }

    public bool Toggle(string id)
    {
        var flag = GetById(id);
        if (flag is null) return false;

        flag.IsEnabled = !flag.IsEnabled;
        flag.UpdatedAt = DateTime.Now;

        _store.AuditEntries.Add(new AuditEntry
        {
            FlagId = flag.Id,
            FlagName = flag.Name,
            Action = "toggled",
            ChangeSummary = $"Flag '{flag.Name}' {(flag.IsEnabled ? "enabled" : "disabled")}"
        });

        return true;
    }

    public bool SetRollout(string id, int percentage)
    {
        if (percentage < 0)
            throw new ArgumentException("Rollout percentage cannot be negative.");

        var flag = GetById(id);
        if (flag is null) return false;

        var previous = flag.RolloutPercentage;
        flag.RolloutPercentage = percentage;
        flag.UpdatedAt = DateTime.Now;

        _store.AuditEntries.Add(new AuditEntry
        {
            FlagId = flag.Id,
            FlagName = flag.Name,
            Action = "rollout_updated",
            ChangeSummary = $"Rollout changed from {previous}% to {percentage}%"
        });

        return true;
    }

    public bool Delete(string id)
    {
        var flag = GetById(id);
        if (flag is null) return false;

        flag.DeletedAt = DateTime.UtcNow;

        _store.AuditEntries.Add(new AuditEntry
        {
            FlagId = flag.Id,
            FlagName = flag.Name,
            Action = "deleted",
            ChangeSummary = $"Flag '{flag.Name}' deleted"
        });

        return true;
    }

    public IEnumerable<AuditEntry> GetAuditLog(string flagId)
    {
        return _store.AuditEntries
            .Where(e => e.FlagId == flagId)
            .OrderBy(e => e.Timestamp);
    }
}
