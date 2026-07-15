using AssetFlow.Application.Features.Audit.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AssetFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AuditLogController : ControllerBase
{
    private readonly IAuditLogService _auditLogService;

    public AuditLogController(IAuditLogService auditLogService)
    {
        _auditLogService = auditLogService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _auditLogService.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var log = await _auditLogService.GetByIdAsync(id);

        if (log == null)
            return NotFound();

        return Ok(log);
    }

    [HttpGet("entity/{entityName}/{entityId}")]
    public async Task<IActionResult> GetByEntity(string entityName, string entityId)
    {
        return Ok(await _auditLogService.GetByEntityAsync(entityName, entityId));
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetByUserId(string userId)
    {
        return Ok(await _auditLogService.GetByUserIdAsync(userId));
    }
}
