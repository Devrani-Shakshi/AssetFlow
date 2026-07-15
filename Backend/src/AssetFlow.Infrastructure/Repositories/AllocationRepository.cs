using AssetFlow.Application.Interfaces;
using AssetFlow.Domain.Entities;
using AssetFlow.Infrastructure.Mongo;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AssetFlow.Infrastructure.Repositories;

public class AllocationRepository : IAllocationRepository
{
    private readonly IMongoCollection<Allocation> _allocations;

    public AllocationRepository(MongoDbContext context)
    {
        _allocations = context.Allocations;
    }

    public async Task CreateAsync(Allocation allocation)
    {
        await _allocations.InsertOneAsync(allocation);
    }

    public async Task UpdateAsync(Allocation allocation)
    {
        await _allocations.ReplaceOneAsync(x => x.Id == allocation.Id, allocation);
    }

    public async Task<Allocation?> GetByIdAsync(string id)
    {
        return await _allocations
            .Find(x => x.Id == id && !x.IsDeleted)
            .FirstOrDefaultAsync();
    }

    public async Task<List<Allocation>> GetHistoryByAssetIdAsync(string assetId)
    {
        return await _allocations
            .Find(x => x.AssetId == assetId && !x.IsDeleted)
            .SortByDescending(x => x.AllocatedDate)
            .ToListAsync();
    }

    public async Task<Allocation?> GetCurrentAllocationByAssetIdAsync(string assetId)
    {
        return await _allocations
            .Find(x => x.AssetId == assetId && x.Status == "Allocated" && !x.IsDeleted)
            .FirstOrDefaultAsync();
    }

    public async Task<List<Allocation>> GetAllAsync()
    {
        return await _allocations
            .Find(x => !x.IsDeleted)
            .ToListAsync();
    }
}
