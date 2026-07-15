using AssetFlow.Application.Features.AssetCategories.DTOs;
using AssetFlow.Application.Features.AssetCategories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AssetCategoryController : ControllerBase
{
    private readonly IAssetCategoryService _categoryService;

    public AssetCategoryController(IAssetCategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateAssetCategoryRequest request)
    {
        return Ok(await _categoryService.CreateAsync(request));
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _categoryService.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var category = await _categoryService.GetByIdAsync(id);

        if (category == null)
            return NotFound();

        return Ok(category);
    }

    [HttpPut]
    public async Task<IActionResult> Update(UpdateAssetCategoryRequest request)
    {
        return Ok(await _categoryService.UpdateAsync(request));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _categoryService.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return Ok("Asset category deleted successfully.");
    }
}
