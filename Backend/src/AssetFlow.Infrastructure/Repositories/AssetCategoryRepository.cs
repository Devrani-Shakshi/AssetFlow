using AssetFlow.Application.Interfaces;
using AssetFlow.Domain.Entities;
using AssetFlow.Infrastructure.Mongo;
using MongoDB.Driver;

namespace AssetFlow.Infrastructure.Repositories;

public class AssetCategoryRepository : IAssetCategoryRepository
{
    private readonly IMongoCollection<AssetCategory> _categories;

    public AssetCategoryRepository(MongoDbContext context)
    {
        _categories = context.AssetCategories;
    }

    public async Task CreateAsync(AssetCategory category)
    {
        await _categories.InsertOneAsync(category);
    }

    public async Task UpdateAsync(AssetCategory category)
    {
        await _categories.ReplaceOneAsync(x => x.Id == category.Id, category);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var category = await GetByIdAsync(id);

        if (category == null)
            return false;

        category.IsDeleted = true;
        category.UpdatedAt = DateTime.UtcNow;

        await UpdateAsync(category);

        return true;
    }

    public async Task<AssetCategory?> GetByIdAsync(string id)
    {
        return await _categories
            .Find(x => x.Id == id && !x.IsDeleted)
            .FirstOrDefaultAsync();
    }

    public async Task<List<AssetCategory>> GetAllAsync()
    {
        return await _categories
            .Find(x => !x.IsDeleted)
            .ToListAsync();
    }

    public async Task<AssetCategory?> GetByCategoryCodeAsync(string categoryCode)
    {
        return await _categories
            .Find(x => x.CategoryCode == categoryCode && !x.IsDeleted)
            .FirstOrDefaultAsync();
    }
}
