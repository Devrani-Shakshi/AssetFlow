using AssetFlow.Application.Features.Maintenance.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AssetFlow.Application.Features.Maintenance.Interfaces;

public interface IAssetMaintenanceService
{
    Task<MaintenanceResponse> CreateAsync(CreateMaintenanceRequest request);

    Task<List<MaintenanceResponse>> GetAllAsync();

    Task<MaintenanceResponse?> GetByIdAsync(string id);

    Task<MaintenanceResponse> UpdateAsync(UpdateMaintenanceRequest request);

    Task<bool> DeleteAsync(string id);

    Task<List<MaintenanceResponse>> GetByAssetIdAsync(string assetId);
}
