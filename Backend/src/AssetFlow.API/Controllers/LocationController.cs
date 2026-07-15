using AssetFlow.Application.Features.Locations.DTOs;
using AssetFlow.Application.Features.Locations.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LocationController : ControllerBase
{
    private readonly ILocationService _locationService;

    public LocationController(ILocationService locationService)
    {
        _locationService = locationService;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateLocationRequest request)
    {
        return Ok(await _locationService.CreateAsync(request));
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _locationService.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var location = await _locationService.GetByIdAsync(id);

        if (location == null)
            return NotFound();

        return Ok(location);
    }

    [HttpPut]
    public async Task<IActionResult> Update(UpdateLocationRequest request)
    {
        return Ok(await _locationService.UpdateAsync(request));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _locationService.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return Ok("Location deleted successfully.");
    }
}
