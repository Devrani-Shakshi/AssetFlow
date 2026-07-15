using AssetFlow.Application.Features.Dashboard.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AssetFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        return Ok(await _dashboardService.GetSummaryAsync());
    }

    [HttpGet("category-summary")]
    public async Task<IActionResult> GetCategorySummary()
    {
        return Ok(await _dashboardService.GetCategorySummaryAsync());
    }

    [HttpGet("department-summary")]
    public async Task<IActionResult> GetDepartmentSummary()
    {
        return Ok(await _dashboardService.GetDepartmentSummaryAsync());
    }

    [HttpGet("monthly-purchases")]
    public async Task<IActionResult> GetMonthlyPurchases()
    {
        return Ok(await _dashboardService.GetMonthlyPurchasesAsync());
    }

    [HttpGet("monthly-allocations")]
    public async Task<IActionResult> GetMonthlyAllocations()
    {
        return Ok(await _dashboardService.GetMonthlyAllocationsAsync());
    }
}
