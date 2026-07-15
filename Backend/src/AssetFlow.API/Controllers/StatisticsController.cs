using AssetFlow.Application.Features.Statistics.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AssetFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StatisticsController : ControllerBase
{
    private readonly IStatisticsService _statisticsService;

    public StatisticsController(IStatisticsService statisticsService)
    {
        _statisticsService = statisticsService;
    }

    [HttpGet("total-cost")]
    public async Task<IActionResult> GetTotalAssetCost()
    {
        return Ok(await _statisticsService.GetTotalAssetCostAsync());
    }

    [HttpGet("by-vendor")]
    public async Task<IActionResult> GetAssetsByVendor()
    {
        return Ok(await _statisticsService.GetAssetsByVendorAsync());
    }

    [HttpGet("by-department")]
    public async Task<IActionResult> GetAssetsByDepartment()
    {
        return Ok(await _statisticsService.GetAssetsByDepartmentAsync());
    }

    [HttpGet("by-category")]
    public async Task<IActionResult> GetAssetsByCategory()
    {
        return Ok(await _statisticsService.GetAssetsByCategoryAsync());
    }

    [HttpGet("maintenance-cost")]
    public async Task<IActionResult> GetTotalMaintenanceCost()
    {
        return Ok(await _statisticsService.GetTotalMaintenanceCostAsync());
    }

    [HttpGet("disposed-count")]
    public async Task<IActionResult> GetDisposedAssetsCount()
    {
        return Ok(await _statisticsService.GetDisposedAssetsCountAsync());
    }

    [HttpGet("warranty-expiring")]
    public async Task<IActionResult> GetWarrantyExpiringSoon([FromQuery] int daysThreshold = 30)
    {
        return Ok(await _statisticsService.GetWarrantyExpiringSoonAsync(daysThreshold));
    }
}
