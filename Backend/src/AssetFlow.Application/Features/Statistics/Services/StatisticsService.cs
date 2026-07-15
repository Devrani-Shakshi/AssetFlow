using AssetFlow.Application.Features.Assets.DTOs;
using AssetFlow.Application.Features.Statistics.Interfaces;
using AssetFlow.Application.Interfaces;
using AssetFlow.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AssetFlow.Application.Features.Statistics.Services;

public class StatisticsService : IStatisticsService
{
    private readonly IAssetRepository _assetRepository;
    private readonly IVendorRepository _vendorRepository;
    private readonly IDepartmentRepository _departmentRepository;
    private readonly IAssetCategoryRepository _categoryRepository;
    private readonly IAssetMaintenanceRepository _maintenanceRepository;
    private readonly IAssetDisposalRepository _disposalRepository;

    public StatisticsService(
        IAssetRepository assetRepository,
        IVendorRepository vendorRepository,
        IDepartmentRepository departmentRepository,
        IAssetCategoryRepository categoryRepository,
        IAssetMaintenanceRepository maintenanceRepository,
        IAssetDisposalRepository disposalRepository)
    {
        _assetRepository = assetRepository;
        _vendorRepository = vendorRepository;
        _departmentRepository = departmentRepository;
        _categoryRepository = categoryRepository;
        _maintenanceRepository = maintenanceRepository;
        _disposalRepository = disposalRepository;
    }

    public async Task<decimal> GetTotalAssetCostAsync()
    {
        var assets = await _assetRepository.GetAllAsync();
        return assets.Sum(x => x.PurchaseCost);
    }

    public async Task<Dictionary<string, int>> GetAssetsByVendorAsync()
    {
        var assets = await _assetRepository.GetAllAsync();
        var vendors = await _vendorRepository.GetAllAsync();

        return assets
            .GroupBy(x => x.VendorId)
            .ToDictionary(
                g => vendors.FirstOrDefault(v => v.Id == g.Key)?.VendorName ?? "Unknown",
                g => g.Count()
            );
    }

    public async Task<Dictionary<string, int>> GetAssetsByDepartmentAsync()
    {
        var assets = await _assetRepository.GetAllAsync();
        var departments = await _departmentRepository.GetAllAsync();

        return assets
            .GroupBy(x => x.DepartmentId)
            .ToDictionary(
                g => departments.FirstOrDefault(d => d.Id == g.Key)?.Name ?? "Unknown",
                g => g.Count()
            );
    }

    public async Task<Dictionary<string, int>> GetAssetsByCategoryAsync()
    {
        var assets = await _assetRepository.GetAllAsync();
        var categories = await _categoryRepository.GetAllAsync();

        return assets
            .GroupBy(x => x.CategoryId)
            .ToDictionary(
                g => categories.FirstOrDefault(c => c.Id == g.Key)?.CategoryName ?? "Unknown",
                g => g.Count()
            );
    }

    public async Task<decimal> GetTotalMaintenanceCostAsync()
    {
        var maintenances = await _maintenanceRepository.GetAllAsync();
        return maintenances.Sum(x => x.Cost);
    }

    public async Task<int> GetDisposedAssetsCountAsync()
    {
        var disposals = await _disposalRepository.GetAllAsync();
        return disposals.Count;
    }

    public async Task<List<AssetResponse>> GetWarrantyExpiringSoonAsync(int daysThreshold)
    {
        var assets = await _assetRepository.GetAllAsync();
        var limitDate = DateTime.UtcNow.AddDays(daysThreshold);

        return assets
            .Where(x => x.WarrantyEnd.HasValue && x.WarrantyEnd.Value > DateTime.UtcNow && x.WarrantyEnd.Value <= limitDate)
            .Select(MapToResponse)
            .ToList();
    }

    private static AssetResponse MapToResponse(Asset asset)
    {
        return new AssetResponse
        {
            Id = asset.Id!,
            AssetCode = asset.AssetCode,
            AssetName = asset.AssetName,
            Description = asset.Description,
            SerialNumber = asset.SerialNumber,
            Barcode = asset.Barcode,
            QRCode = asset.QRCode,
            CategoryId = asset.CategoryId,
            VendorId = asset.VendorId,
            DepartmentId = asset.DepartmentId,
            AssignedEmployeeId = asset.AssignedEmployeeId,
            LocationId = asset.LocationId,
            PurchaseDate = asset.PurchaseDate,
            PurchaseCost = asset.PurchaseCost,
            WarrantyStart = asset.WarrantyStart,
            WarrantyEnd = asset.WarrantyEnd,
            DepreciationRate = asset.DepreciationRate,
            CurrentValue = asset.CurrentValue,
            Condition = asset.Condition,
            Status = asset.Status,
            Notes = asset.Notes,
            ImageUrls = asset.ImageUrls,
            InvoiceDocument = asset.InvoiceDocument
        };
    }
}
