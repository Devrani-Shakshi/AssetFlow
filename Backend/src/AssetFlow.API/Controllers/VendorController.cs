using AssetFlow.Application.Features.Vendors.DTOs;
using AssetFlow.Application.Features.Vendors.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class VendorController : ControllerBase
{
    private readonly IVendorService _vendorService;

    public VendorController(IVendorService vendorService)
    {
        _vendorService = vendorService;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateVendorRequest request)
    {
        return Ok(await _vendorService.CreateAsync(request));
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _vendorService.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var vendor = await _vendorService.GetByIdAsync(id);

        if (vendor == null)
            return NotFound();

        return Ok(vendor);
    }

    [HttpPut]
    public async Task<IActionResult> Update(UpdateVendorRequest request)
    {
        return Ok(await _vendorService.UpdateAsync(request));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _vendorService.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return Ok("Vendor deleted successfully.");
    }
}