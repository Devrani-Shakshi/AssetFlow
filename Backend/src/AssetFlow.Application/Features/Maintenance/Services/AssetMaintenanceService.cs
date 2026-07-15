using AssetFlow.Application.Features.Maintenance.DTOs;
using AssetFlow.Application.Features.Maintenance.Interfaces;
using AssetFlow.Application.Interfaces;
using AssetFlow.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AssetFlow.Application.Features.Maintenance.Services;

public class AssetMaintenanceService : IAssetMaintenanceService
{
    private readonly IAssetMaintenanceRepository _maintenanceRepository;
    private readonly IAssetRepository _assetRepository;

    public AssetMaintenanceService(IAssetMaintenanceRepository maintenanceRepository, IAssetRepository assetRepository)
    {
        _maintenanceRepository = maintenanceRepository;
        _assetRepository = assetRepository;
    }

    public async Task<MaintenanceResponse> CreateAsync(CreateMaintenanceRequest request)
    {
        var asset = await _assetRepository.GetByIdAsync(request.AssetId);
        if (asset == null)
            throw new Exception("Asset not found.");

        var maintenance = new AssetMaintenance
        {
            AssetId = request.AssetId,
            VendorId = request.VendorId,
            MaintenanceDate = request.MaintenanceDate,
            MaintenanceType = request.MaintenanceType,
            Description = request.Description,
            Cost = request.Cost,
            Status = "Scheduled",
            ExpectedCompletionDate = request.ExpectedCompletionDate,
            Remarks = request.Remarks
        };

        await _maintenanceRepository.CreateAsync(maintenance);

        return MapToResponse(maintenance);
    }

    public async Task<List<MaintenanceResponse>> GetAllAsync()
    {
        var list = await _maintenanceRepository.GetAllAsync();
        return list.Select(MapToResponse).ToList();
    }

    public async Task<MaintenanceResponse?> GetByIdAsync(string id)
    {
        var maintenance = await _maintenanceRepository.GetByIdAsync(id);
        if (maintenance == null)
            return null;

        return MapToResponse(maintenance);
    }

    public async Task<MaintenanceResponse> UpdateAsync(UpdateMaintenanceRequest request)
    {
        var maintenance = await _maintenanceRepository.GetByIdAsync(request.Id);
        if (maintenance == null)
            throw new Exception("Maintenance record not found.");

        var asset = await _assetRepository.GetByIdAsync(request.AssetId);
        if (asset == null)
            throw new Exception("Asset not found.");

        maintenance.AssetId = request.AssetId;
        maintenance.VendorId = request.VendorId;
        maintenance.MaintenanceDate = request.MaintenanceDate;
        maintenance.MaintenanceType = request.MaintenanceType;
        maintenance.Description = request.Description;
        maintenance.Cost = request.Cost;
        maintenance.Status = request.Status;
        maintenance.ExpectedCompletionDate = request.ExpectedCompletionDate;
        maintenance.CompletedDate = request.CompletedDate;
        maintenance.Remarks = request.Remarks;
        maintenance.UpdatedAt = DateTime.UtcNow;

        await _maintenanceRepository.UpdateAsync(maintenance);

        // Update asset status based on maintenance status
        if (request.Status.Equals("In Progress", StringComparison.OrdinalIgnoreCase))
        {
            asset.Status = "Under Maintenance";
            asset.UpdatedAt = DateTime.UtcNow;
            await _assetRepository.UpdateAsync(asset);
        }
        else if (request.Status.Equals("Completed", StringComparison.OrdinalIgnoreCase) ||
                 request.Status.Equals("Cancelled", StringComparison.OrdinalIgnoreCase))
        {
            asset.Status = "Available";
            asset.UpdatedAt = DateTime.UtcNow;
            await _assetRepository.UpdateAsync(asset);
        }

        return MapToResponse(maintenance);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var maintenance = await _maintenanceRepository.GetByIdAsync(id);
        if (maintenance == null)
            return false;

        // If the maintenance was in progress, set asset back to available
        if (maintenance.Status.Equals("In Progress", StringComparison.OrdinalIgnoreCase))
        {
            var asset = await _assetRepository.GetByIdAsync(maintenance.AssetId);
            if (asset != null)
            {
                asset.Status = "Available";
                asset.UpdatedAt = DateTime.UtcNow;
                await _assetRepository.UpdateAsync(asset);
            }
        }

        return await _maintenanceRepository.DeleteAsync(id);
    }

    public async Task<List<MaintenanceResponse>> GetByAssetIdAsync(string assetId)
    {
        var list = await _maintenanceRepository.GetByAssetIdAsync(assetId);
        return list.Select(MapToResponse).ToList();
    }

    private static MaintenanceResponse MapToResponse(AssetMaintenance m)
    {
        return new MaintenanceResponse
        {
            Id = m.Id!,
            AssetId = m.AssetId,
            VendorId = m.VendorId,
            MaintenanceDate = m.MaintenanceDate,
            MaintenanceType = m.MaintenanceType,
            Description = m.Description,
            Cost = m.Cost,
            Status = m.Status,
            ExpectedCompletionDate = m.ExpectedCompletionDate,
            CompletedDate = m.CompletedDate,
            Remarks = m.Remarks
        };
    }
}
