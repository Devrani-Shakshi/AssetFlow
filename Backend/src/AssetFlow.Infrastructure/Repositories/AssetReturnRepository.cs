using AssetFlow.Application.Interfaces;
using AssetFlow.Domain.Entities;
using AssetFlow.Infrastructure.Mongo;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AssetFlow.Infrastructure.Repositories;

public class AssetReturnRepository : IAssetReturnRepository
{
    private readonly IMongoCollection<AssetReturn> _returns;

    public AssetReturnRepository(MongoDbContext context)
    {
        _returns = context.AssetReturns;
    }

    public async Task CreateAsync(AssetReturn assetReturn)
    {
        await _returns.InsertOneAsync(assetReturn);
    }

    public async Task<AssetReturn?> GetByIdAsync(string id)
    {
        return await _returns
            .Find(x => x.Id == id && !x.IsDeleted)
            .FirstOrDefaultAsync();
    }

    public async Task<List<AssetReturn>> GetHistoryByAssetIdAsync(string assetId)
    {
        return await _returns
            .Find(x => x.AssetId == assetId && !x.IsDeleted)
            .SortByDescending(x => x.ReturnDate)
            .ToListAsync();
    }

    public async Task<List<AssetReturn>> GetAllAsync()
    {
        return await _returns
            .Find(x => !x.IsDeleted)
            .ToListAsync();
    }
}
