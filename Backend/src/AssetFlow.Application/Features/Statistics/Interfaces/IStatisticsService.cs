using AssetFlow.Application.Features.Assets.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AssetFlow.Application.Features.Statistics.Interfaces;

public interface IStatisticsService
{
    Task<decimal> GetTotalAssetCostAsync();

    Task<Dictionary<string, int>> GetAssetsByVendorAsync();

    Task<Dictionary<string, int>> GetAssetsByDepartmentAsync();

    Task<Dictionary<string, int>> GetAssetsByCategoryAsync();

    Task<decimal> GetTotalMaintenanceCostAsync();

    Task<int> GetDisposedAssetsCountAsync();

    Task<List<AssetResponse>> GetWarrantyExpiringSoonAsync(int daysThreshold);
}
