namespace FeatureFlags.Api.Models;

public class AuditEntry
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string FlagId { get; set; } = string.Empty;
    public string FlagName { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string ChangeSummary { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.Now;
}
