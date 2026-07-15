using AssetFlow.Application.Interfaces;
using AssetFlow.Domain.Entities;
using AssetFlow.Infrastructure.Mongo;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AssetFlow.Infrastructure.Repositories;

public class AssetDisposalRepository : IAssetDisposalRepository
{
    private readonly IMongoCollection<AssetDisposal> _disposals;

    public AssetDisposalRepository(MongoDbContext context)
    {
        _disposals = context.AssetDisposals;
    }

    public async Task CreateAsync(AssetDisposal disposal)
    {
        await _disposals.InsertOneAsync(disposal);
    }

    public async Task UpdateAsync(AssetDisposal disposal)
    {
        await _disposals.ReplaceOneAsync(x => x.Id == disposal.Id, disposal);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var disposal = await GetByIdAsync(id);

        if (disposal == null)
            return false;

        disposal.IsDeleted = true;
        disposal.UpdatedAt = DateTime.UtcNow;

        await UpdateAsync(disposal);

        return true;
    }

    public async Task<AssetDisposal?> GetByIdAsync(string id)
    {
        return await _disposals
            .Find(x => x.Id == id && !x.IsDeleted)
            .FirstOrDefaultAsync();
    }

    public async Task<List<AssetDisposal>> GetAllAsync()
    {
        return await _disposals
            .Find(x => !x.IsDeleted)
            .ToListAsync();
    }

    public async Task<AssetDisposal?> GetByAssetIdAsync(string assetId)
    {
        return await _disposals
            .Find(x => x.AssetId == assetId && !x.IsDeleted)
            .FirstOrDefaultAsync();
    }
}
