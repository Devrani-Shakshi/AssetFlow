using AssetFlow.Domain.Entities;

namespace AssetFlow.Application.Interfaces;

public interface IAssetCategoryRepository
{
    Task CreateAsync(AssetCategory category);

    Task UpdateAsync(AssetCategory category);

    Task<bool> DeleteAsync(string id);

    Task<AssetCategory?> GetByIdAsync(string id);

    Task<List<AssetCategory>> GetAllAsync();

    Task<AssetCategory?> GetByCategoryCodeAsync(string categoryCode);
}
