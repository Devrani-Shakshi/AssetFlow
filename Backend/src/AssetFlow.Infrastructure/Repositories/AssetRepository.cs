using AssetFlow.Application.Interfaces;
using AssetFlow.Domain.Entities;
using AssetFlow.Infrastructure.Mongo;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AssetFlow.Infrastructure.Repositories;

public class AssetRepository : IAssetRepository
{
    private readonly IMongoCollection<Asset> _assets;

    public AssetRepository(MongoDbContext context)
    {
        _assets = context.Assets;
    }

    public async Task CreateAsync(Asset asset)
    {
        await _assets.InsertOneAsync(asset);
    }

    public async Task UpdateAsync(Asset asset)
    {
        await _assets.ReplaceOneAsync(x => x.Id == asset.Id, asset);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var asset = await GetByIdAsync(id);

        if (asset == null)
            return false;

        asset.IsDeleted = true;
        asset.UpdatedAt = DateTime.UtcNow;

        await UpdateAsync(asset);

        return true;
    }

    public async Task<Asset?> GetByIdAsync(string id)
    {
        return await _assets
            .Find(x => x.Id == id && !x.IsDeleted)
            .FirstOrDefaultAsync();
    }

    public async Task<List<Asset>> GetAllAsync()
    {
        return await _assets
            .Find(x => !x.IsDeleted)
            .ToListAsync();
    }

    public async Task<Asset?> GetByAssetCodeAsync(string assetCode)
    {
        return await _assets
            .Find(x => x.AssetCode == assetCode && !x.IsDeleted)
            .FirstOrDefaultAsync();
    }

    public async Task<List<Asset>> SearchAndFilterAsync(string? searchTerm, string? categoryId, string? status, string? locationId)
    {
        var builder = Builders<Asset>.Filter;
        var filter = builder.Eq(x => x.IsDeleted, false);

        if (!string.IsNullOrEmpty(searchTerm))
        {
            var searchFilter = builder.Or(
                builder.Regex(x => x.AssetName, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i")),
                builder.Regex(x => x.AssetCode, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i")),
                builder.Regex(x => x.SerialNumber, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i"))
            );
            filter = builder.And(filter, searchFilter);
        }

        if (!string.IsNullOrEmpty(categoryId))
        {
            filter = builder.And(filter, builder.Eq(x => x.CategoryId, categoryId));
        }

        if (!string.IsNullOrEmpty(status))
        {
            filter = builder.And(filter, builder.Eq(x => x.Status, status));
        }

        if (!string.IsNullOrEmpty(locationId))
        {
            filter = builder.And(filter, builder.Eq(x => x.LocationId, locationId));
        }

        return await _assets.Find(filter).ToListAsync();
    }

    public async Task<(List<Asset> Items, long TotalCount)> SearchAdvancedAsync(
        string? searchTerm,
        string? categoryId,
        string? status,
        string? locationId,
        string? departmentId,
        string? vendorId,
        string? condition,
        DateTime? warrantyExpiryBefore,
        DateTime? purchaseDateAfter,
        string? sortBy,
        bool isDescending,
        int pageNumber,
        int pageSize)
    {
        var builder = Builders<Asset>.Filter;
        var filter = builder.Eq(x => x.IsDeleted, false);

        if (!string.IsNullOrEmpty(searchTerm))
        {
            var searchFilter = builder.Or(
                builder.Regex(x => x.AssetName, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i")),
                builder.Regex(x => x.AssetCode, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i")),
                builder.Regex(x => x.SerialNumber, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i"))
            );
            filter = builder.And(filter, searchFilter);
        }

        if (!string.IsNullOrEmpty(categoryId))
        {
            filter = builder.And(filter, builder.Eq(x => x.CategoryId, categoryId));
        }

        if (!string.IsNullOrEmpty(status))
        {
            filter = builder.And(filter, builder.Eq(x => x.Status, status));
        }

        if (!string.IsNullOrEmpty(locationId))
        {
            filter = builder.And(filter, builder.Eq(x => x.LocationId, locationId));
        }

        if (!string.IsNullOrEmpty(departmentId))
        {
            filter = builder.And(filter, builder.Eq(x => x.DepartmentId, departmentId));
        }

        if (!string.IsNullOrEmpty(vendorId))
        {
            filter = builder.And(filter, builder.Eq(x => x.VendorId, vendorId));
        }

        if (!string.IsNullOrEmpty(condition))
        {
            filter = builder.And(filter, builder.Eq(x => x.Condition, condition));
        }

        if (warrantyExpiryBefore.HasValue)
        {
            filter = builder.And(filter, builder.Lte(x => x.WarrantyEnd, warrantyExpiryBefore.Value));
        }

        if (purchaseDateAfter.HasValue)
        {
            filter = builder.And(filter, builder.Gte(x => x.PurchaseDate, purchaseDateAfter.Value));
        }

        var totalCount = await _assets.CountDocumentsAsync(filter);

        var findFluent = _assets.Find(filter);
        if (!string.IsNullOrEmpty(sortBy))
        {
            var sort = isDescending 
                ? Builders<Asset>.Sort.Descending(sortBy) 
                : Builders<Asset>.Sort.Ascending(sortBy);
            findFluent = findFluent.Sort(sort);
        }
        else
        {
            findFluent = findFluent.Sort(Builders<Asset>.Sort.Descending(x => x.CreatedAt));
        }

        var items = await findFluent
            .Skip((pageNumber - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }
}
