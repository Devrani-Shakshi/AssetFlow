using AssetFlow.Application.Features.AssetCategories.DTOs;

namespace AssetFlow.Application.Features.AssetCategories.Interfaces;

public interface IAssetCategoryService
{
    Task<AssetCategoryResponse> CreateAsync(CreateAssetCategoryRequest request);

    Task<List<AssetCategoryResponse>> GetAllAsync();

    Task<AssetCategoryResponse?> GetByIdAsync(string id);

    Task<AssetCategoryResponse> UpdateAsync(UpdateAssetCategoryRequest request);

    Task<bool> DeleteAsync(string id);
}
