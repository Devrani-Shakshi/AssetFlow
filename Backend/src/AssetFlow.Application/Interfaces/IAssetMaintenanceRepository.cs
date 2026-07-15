using AssetFlow.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AssetFlow.Application.Interfaces;

public interface IAssetMaintenanceRepository
{
    Task CreateAsync(AssetMaintenance maintenance);

    Task UpdateAsync(AssetMaintenance maintenance);

    Task<bool> DeleteAsync(string id);

    Task<AssetMaintenance?> GetByIdAsync(string id);

    Task<List<AssetMaintenance>> GetAllAsync();

    Task<List<AssetMaintenance>> GetByAssetIdAsync(string assetId);
}
