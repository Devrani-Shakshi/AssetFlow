using AssetFlow.Application.Interfaces;
using AssetFlow.Domain.Entities;
using AssetFlow.Infrastructure.Mongo;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AssetFlow.Infrastructure.Repositories;

public class AssetMaintenanceRepository : IAssetMaintenanceRepository
{
    private readonly IMongoCollection<AssetMaintenance> _maintenances;

    public AssetMaintenanceRepository(MongoDbContext context)
    {
        _maintenances = context.AssetMaintenances;
    }

    public async Task CreateAsync(AssetMaintenance maintenance)
    {
        await _maintenances.InsertOneAsync(maintenance);
    }

    public async Task UpdateAsync(AssetMaintenance maintenance)
    {
        await _maintenances.ReplaceOneAsync(x => x.Id == maintenance.Id, maintenance);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var maintenance = await GetByIdAsync(id);

        if (maintenance == null)
            return false;

        maintenance.IsDeleted = true;
        maintenance.UpdatedAt = DateTime.UtcNow;

        await UpdateAsync(maintenance);

        return true;
    }

    public async Task<AssetMaintenance?> GetByIdAsync(string id)
    {
        return await _maintenances
            .Find(x => x.Id == id && !x.IsDeleted)
            .FirstOrDefaultAsync();
    }

    public async Task<List<AssetMaintenance>> GetAllAsync()
    {
        return await _maintenances
            .Find(x => !x.IsDeleted)
            .ToListAsync();
    }

    public async Task<List<AssetMaintenance>> GetByAssetIdAsync(string assetId)
    {
        return await _maintenances
            .Find(x => x.AssetId == assetId && !x.IsDeleted)
            .ToListAsync();
    }
}
