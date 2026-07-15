using AssetFlow.Application.Features.Reports.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AssetFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("assets-report")]
    public async Task<IActionResult> GetAssetsReport()
    {
        return Ok(await _reportService.GetAssetsReportAsync());
    }

    [HttpGet("vendors-report")]
    public async Task<IActionResult> GetVendorsReport()
    {
        return Ok(await _reportService.GetVendorsReportAsync());
    }

    [HttpGet("employees-report")]
    public async Task<IActionResult> GetEmployeesReport()
    {
        return Ok(await _reportService.GetEmployeesReportAsync());
    }

    [HttpGet("departments-report")]
    public async Task<IActionResult> GetDepartmentsReport()
    {
        return Ok(await _reportService.GetDepartmentsReportAsync());
    }

    [HttpGet("maintenance-report")]
    public async Task<IActionResult> GetMaintenanceReport()
    {
        return Ok(await _reportService.GetMaintenanceReportAsync());
    }

    [HttpGet("disposal-report")]
    public async Task<IActionResult> GetDisposalReport()
    {
        return Ok(await _reportService.GetDisposalReportAsync());
    }

    [HttpGet("warranty-expiry")]
    public async Task<IActionResult> GetWarrantyExpiryReport()
    {
        return Ok(await _reportService.GetWarrantyExpiryReportAsync());
    }
}
