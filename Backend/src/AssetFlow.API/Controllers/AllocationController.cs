using AssetFlow.Application.Features.AssetAllocation.DTOs;
using AssetFlow.Application.Features.AssetAllocation.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AssetFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AllocationController : ControllerBase
{
    private readonly IAllocationService _allocationService;

    public AllocationController(IAllocationService allocationService)
    {
        _allocationService = allocationService;
    }

    [HttpPost("allocate")]
    public async Task<IActionResult> Allocate(AllocateAssetRequest request)
    {
        return Ok(await _allocationService.AllocateAsync(request));
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _allocationService.GetAllAsync());
    }

    [HttpGet("history/{assetId}")]
    public async Task<IActionResult> GetHistory(string assetId)
    {
        return Ok(await _allocationService.GetHistoryByAssetIdAsync(assetId));
    }

    [HttpGet("current/{assetId}")]
    public async Task<IActionResult> GetCurrent(string assetId)
    {
        var allocation = await _allocationService.GetCurrentAllocationByAssetIdAsync(assetId);

        if (allocation == null)
            return NotFound();

        return Ok(allocation);
    }
}
