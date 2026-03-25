namespace FeatureFlags.Api.Controllers;

using FeatureFlags.Api.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/flags")]
public class FeatureFlagsController : ControllerBase
{
    private readonly FeatureFlagService _service;

    public FeatureFlagsController(FeatureFlagService service)
    {
        _service = service;
    }

    [HttpGet]
    public IActionResult GetFlags() => Ok(_service.GetAll());

    [HttpGet("{id}")]
    public IActionResult GetFlag(string id)
    {
        var flag = _service.GetById(id);
        return flag is null ? NotFound() : Ok(flag);
    }

    [HttpPost]
    public IActionResult CreateFlag([FromBody] CreateFlagRequest body)
    {
        if (string.IsNullOrWhiteSpace(body.Name))
            return BadRequest();

        var flag = _service.Create(body.Name, body.Description ?? string.Empty, body.Environment ?? "production");
        return CreatedAtAction(nameof(GetFlag), new { id = flag.Id }, flag);
    }

    [HttpPost("{id}/toggle")]
    public IActionResult ToggleFlag(string id)
    {
        var success = _service.Toggle(id);
        return success ? NoContent() : NotFound();
    }

    [HttpPut("{id}/rollout")]
    public IActionResult SetRollout(string id, [FromBody] SetRolloutRequest body)
    {
        try
        {
            var success = _service.SetRollout(id, body.Percentage);
            return success ? NoContent() : NotFound();
        }
        catch (ArgumentException)
        {
            return BadRequest();
        }
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteFlag(string id)
    {
        var success = _service.Delete(id);
        return success ? NoContent() : NotFound();
    }

    [HttpGet("{id}/audit")]
    public IActionResult GetAuditLog(string id) => Ok(_service.GetAuditLog(id));

    public record CreateFlagRequest(string Name, string? Description, string? Environment);
    public record SetRolloutRequest(int Percentage);
}
