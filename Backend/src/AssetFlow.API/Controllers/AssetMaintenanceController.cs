using AssetFlow.Application.Features.Maintenance.DTOs;
using AssetFlow.Application.Features.Maintenance.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AssetFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AssetMaintenanceController : ControllerBase
{
    private readonly IAssetMaintenanceService _maintenanceService;

    public AssetMaintenanceController(IAssetMaintenanceService maintenanceService)
    {
        _maintenanceService = maintenanceService;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateMaintenanceRequest request)
    {
        return Ok(await _maintenanceService.CreateAsync(request));
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _maintenanceService.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var maintenance = await _maintenanceService.GetByIdAsync(id);

        if (maintenance == null)
            return NotFound();

        return Ok(maintenance);
    }

    [HttpPut]
    public async Task<IActionResult> Update(UpdateMaintenanceRequest request)
    {
        return Ok(await _maintenanceService.UpdateAsync(request));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _maintenanceService.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return Ok("Maintenance record deleted successfully.");
    }

    [HttpGet("asset/{assetId}")]
    public async Task<IActionResult> GetByAssetId(string assetId)
    {
        return Ok(await _maintenanceService.GetByAssetIdAsync(assetId));
    }
}
