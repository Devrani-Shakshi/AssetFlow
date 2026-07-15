using AssetFlow.Application.Features.AssetDisposal.DTOs;
using AssetFlow.Application.Features.AssetDisposal.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AssetFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AssetDisposalController : ControllerBase
{
    private readonly IAssetDisposalService _disposalService;

    public AssetDisposalController(IAssetDisposalService disposalService)
    {
        _disposalService = disposalService;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateDisposalRequest request)
    {
        return Ok(await _disposalService.CreateAsync(request));
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _disposalService.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var disposal = await _disposalService.GetByIdAsync(id);

        if (disposal == null)
            return NotFound();

        return Ok(disposal);
    }

    [HttpPut]
    public async Task<IActionResult> Update(UpdateDisposalRequest request)
    {
        return Ok(await _disposalService.UpdateAsync(request));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _disposalService.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return Ok("Asset disposal record deleted successfully.");
    }
}
