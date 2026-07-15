using AssetFlow.Application.Features.AssetCategories.DTOs;
using AssetFlow.Application.Features.AssetCategories.Interfaces;
using AssetFlow.Application.Interfaces;
using AssetFlow.Domain.Entities;

namespace AssetFlow.Application.Features.AssetCategories.Services;

public class AssetCategoryService : IAssetCategoryService
{
    private readonly IAssetCategoryRepository _categoryRepository;

    public AssetCategoryService(IAssetCategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<AssetCategoryResponse> CreateAsync(CreateAssetCategoryRequest request)
    {
        var existingCode = await _categoryRepository.GetByCategoryCodeAsync(request.CategoryCode);

        if (existingCode != null)
            throw new Exception("Asset category code already exists.");

        var category = new AssetCategory
        {
            CategoryCode = request.CategoryCode,
            CategoryName = request.CategoryName,
            Description = request.Description,
            DepreciationRate = request.DepreciationRate,
            UsefulLifeYears = request.UsefulLifeYears,
            IsActive = true
        };

        await _categoryRepository.CreateAsync(category);

        return new AssetCategoryResponse
        {
            Id = category.Id!,
            CategoryCode = category.CategoryCode,
            CategoryName = category.CategoryName,
            Description = category.Description,
            DepreciationRate = category.DepreciationRate,
            UsefulLifeYears = category.UsefulLifeYears,
            IsActive = category.IsActive
        };
    }

    public async Task<List<AssetCategoryResponse>> GetAllAsync()
    {
        var categories = await _categoryRepository.GetAllAsync();

        return categories.Select(c => new AssetCategoryResponse
        {
            Id = c.Id!,
            CategoryCode = c.CategoryCode,
            CategoryName = c.CategoryName,
            Description = c.Description,
            DepreciationRate = c.DepreciationRate,
            UsefulLifeYears = c.UsefulLifeYears,
            IsActive = c.IsActive
        }).ToList();
    }

    public async Task<AssetCategoryResponse?> GetByIdAsync(string id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);

        if (category == null)
            return null;

        return new AssetCategoryResponse
        {
            Id = category.Id!,
            CategoryCode = category.CategoryCode,
            CategoryName = category.CategoryName,
            Description = category.Description,
            DepreciationRate = category.DepreciationRate,
            UsefulLifeYears = category.UsefulLifeYears,
            IsActive = category.IsActive
        };
    }

    public async Task<AssetCategoryResponse> UpdateAsync(UpdateAssetCategoryRequest request)
    {
        var category = await _categoryRepository.GetByIdAsync(request.Id);

        if (category == null)
            throw new Exception("Asset category not found.");

        category.CategoryCode = request.CategoryCode;
        category.CategoryName = request.CategoryName;
        category.Description = request.Description;
        category.DepreciationRate = request.DepreciationRate;
        category.UsefulLifeYears = request.UsefulLifeYears;
        category.IsActive = request.IsActive;
        category.UpdatedAt = DateTime.UtcNow;

        await _categoryRepository.UpdateAsync(category);

        return new AssetCategoryResponse
        {
            Id = category.Id!,
            CategoryCode = category.CategoryCode,
            CategoryName = category.CategoryName,
            Description = category.Description,
            DepreciationRate = category.DepreciationRate,
            UsefulLifeYears = category.UsefulLifeYears,
            IsActive = category.IsActive
        };
    }

    public async Task<bool> DeleteAsync(string id)
    {
        return await _categoryRepository.DeleteAsync(id);
    }
}
