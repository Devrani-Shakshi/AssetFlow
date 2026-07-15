using AssetFlow.Application.Features.AssetReturn.DTOs;
using AssetFlow.Application.Features.AssetReturn.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AssetFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AssetReturnController : ControllerBase
{
    private readonly IAssetReturnService _returnService;

    public AssetReturnController(IAssetReturnService returnService)
    {
        _returnService = returnService;
    }

    [HttpPost("return")]
    public async Task<IActionResult> Return(ProcessReturnRequest request)
    {
        return Ok(await _returnService.ReturnAsync(request));
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _returnService.GetAllAsync());
    }

    [HttpGet("history/{assetId}")]
    public async Task<IActionResult> GetHistory(string assetId)
    {
        return Ok(await _returnService.GetHistoryByAssetIdAsync(assetId));
    }
}
