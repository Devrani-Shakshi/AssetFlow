using AssetFlow.Application.Features.Assets.DTOs;
using AssetFlow.Application.Features.Assets.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AssetFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AssetController : ControllerBase
{
    private readonly IAssetService _assetService;

    public AssetController(IAssetService assetService)
    {
        _assetService = assetService;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateAssetRequest request)
    {
        return Ok(await _assetService.CreateAsync(request));
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _assetService.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var asset = await _assetService.GetByIdAsync(id);

        if (asset == null)
            return NotFound();

        return Ok(asset);
    }

    [HttpPut]
    public async Task<IActionResult> Update(UpdateAssetRequest request)
    {
        return Ok(await _assetService.UpdateAsync(request));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _assetService.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return Ok("Asset deleted successfully.");
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string? searchTerm, [FromQuery] string? categoryId, [FromQuery] string? status, [FromQuery] string? locationId)
    {
        return Ok(await _assetService.SearchAndFilterAsync(searchTerm, categoryId, status, locationId));
    }

    [HttpGet("search-advanced")]
    public async Task<IActionResult> SearchAdvanced([FromQuery] SearchAssetsRequest request)
    {
        return Ok(await _assetService.SearchAdvancedAsync(request));
    }

    [HttpPost("assign")]
    public async Task<IActionResult> Assign(AssignAssetRequest request)
    {
        return Ok(await _assetService.AssignAsync(request));
    }

    [HttpPost("transfer")]
    public async Task<IActionResult> Transfer(TransferAssetRequest request)
    {
        return Ok(await _assetService.TransferAsync(request));
    }

    [HttpPost("return")]
    public async Task<IActionResult> Return(ReturnAssetRequest request)
    {
        return Ok(await _assetService.ReturnAsync(request));
    }
}
