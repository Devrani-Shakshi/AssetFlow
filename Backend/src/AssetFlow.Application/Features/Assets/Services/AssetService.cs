using AssetFlow.Application.Features.Assets.DTOs;
using AssetFlow.Application.Features.Assets.Interfaces;
using AssetFlow.Application.Interfaces;
using AssetFlow.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using AssetFlow.Application.Features.Audit.Interfaces;

namespace AssetFlow.Application.Features.Assets.Services;

public class AssetService : IAssetService
{
    private readonly IAssetRepository _assetRepository;
    private readonly IAuditLogService _auditLogService;

    public AssetService(IAssetRepository assetRepository, IAuditLogService auditLogService)
    {
        _assetRepository = assetRepository;
        _auditLogService = auditLogService;
    }

    public async Task<AssetResponse> CreateAsync(CreateAssetRequest request)
    {
        var existing = await _assetRepository.GetByAssetCodeAsync(request.AssetCode);

        if (existing != null)
            throw new Exception("Asset code already exists.");

        var asset = new Asset
        {
            AssetCode = request.AssetCode,
            AssetName = request.AssetName,
            Description = request.Description,
            SerialNumber = request.SerialNumber,
            Barcode = request.Barcode,
            QRCode = request.QRCode,
            CategoryId = request.CategoryId,
            VendorId = request.VendorId,
            DepartmentId = request.DepartmentId,
            LocationId = request.LocationId,
            PurchaseDate = request.PurchaseDate,
            PurchaseCost = request.PurchaseCost,
            WarrantyStart = request.WarrantyStart,
            WarrantyEnd = request.WarrantyEnd,
            DepreciationRate = request.DepreciationRate,
            CurrentValue = request.PurchaseCost, // Initially current value equals purchase cost
            Condition = request.Condition,
            Status = "Available",
            Notes = request.Notes,
            ImageUrls = request.ImageUrls,
            InvoiceDocument = request.InvoiceDocument
        };

        await _assetRepository.CreateAsync(asset);

        await _auditLogService.LogActionAsync("Create", "Asset", asset.Id!, null, asset);

        return MapToResponse(asset);
    }

    public async Task<List<AssetResponse>> GetAllAsync()
    {
        var assets = await _assetRepository.GetAllAsync();

        return assets.Select(MapToResponse).ToList();
    }

    public async Task<AssetResponse?> GetByIdAsync(string id)
    {
        var asset = await _assetRepository.GetByIdAsync(id);

        if (asset == null)
            return null;

        return MapToResponse(asset);
    }

    public async Task<AssetResponse> UpdateAsync(UpdateAssetRequest request)
    {
        var asset = await _assetRepository.GetByIdAsync(request.Id);

        if (asset == null)
            throw new Exception("Asset not found.");

        var oldValue = new Asset
        {
            Id = asset.Id,
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
            InvoiceDocument = asset.InvoiceDocument,
            IsDeleted = asset.IsDeleted,
            CreatedAt = asset.CreatedAt,
            UpdatedAt = asset.UpdatedAt
        };

        asset.AssetCode = request.AssetCode;
        asset.AssetName = request.AssetName;
        asset.Description = request.Description;
        asset.SerialNumber = request.SerialNumber;
        asset.Barcode = request.Barcode;
        asset.QRCode = request.QRCode;
        asset.CategoryId = request.CategoryId;
        asset.VendorId = request.VendorId;
        asset.DepartmentId = request.DepartmentId;
        asset.LocationId = request.LocationId;
        asset.PurchaseDate = request.PurchaseDate;
        asset.PurchaseCost = request.PurchaseCost;
        asset.WarrantyStart = request.WarrantyStart;
        asset.WarrantyEnd = request.WarrantyEnd;
        asset.DepreciationRate = request.DepreciationRate;
        asset.CurrentValue = request.CurrentValue;
        asset.Condition = request.Condition;
        asset.Status = request.Status;
        asset.Notes = request.Notes;
        asset.ImageUrls = request.ImageUrls;
        asset.InvoiceDocument = request.InvoiceDocument;
        asset.UpdatedAt = DateTime.UtcNow;

        await _assetRepository.UpdateAsync(asset);

        await _auditLogService.LogActionAsync("Update", "Asset", asset.Id!, oldValue, asset);

        return MapToResponse(asset);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var asset = await _assetRepository.GetByIdAsync(id);
        if (asset == null)
            return false;

        var deleted = await _assetRepository.DeleteAsync(id);
        if (deleted)
        {
            await _auditLogService.LogActionAsync("Delete", "Asset", id, asset, null);
        }
        return deleted;
    }

    public async Task<List<AssetResponse>> SearchAndFilterAsync(string? searchTerm, string? categoryId, string? status, string? locationId)
    {
        var assets = await _assetRepository.SearchAndFilterAsync(searchTerm, categoryId, status, locationId);

        return assets.Select(MapToResponse).ToList();
    }

    public async Task<AssetResponse> AssignAsync(AssignAssetRequest request)
    {
        var asset = await _assetRepository.GetByIdAsync(request.AssetId);

        if (asset == null)
            throw new Exception("Asset not found.");

        if (asset.Status != "Available")
            throw new Exception("Asset is not available for allocation.");

        var oldValue = CloneAsset(asset);

        asset.AssignedEmployeeId = request.EmployeeId;
        asset.Status = "Allocated";
        asset.UpdatedAt = DateTime.UtcNow;

        await _assetRepository.UpdateAsync(asset);

        await _auditLogService.LogActionAsync("Allocate", "Asset", asset.Id!, oldValue, asset);

        return MapToResponse(asset);
    }

    public async Task<AssetResponse> TransferAsync(TransferAssetRequest request)
    {
        var asset = await _assetRepository.GetByIdAsync(request.AssetId);

        if (asset == null)
            throw new Exception("Asset not found.");

        if (asset.Status != "Allocated")
            throw new Exception("Only allocated assets can be transferred.");

        var oldValue = CloneAsset(asset);

        asset.AssignedEmployeeId = request.ToEmployeeId;
        asset.UpdatedAt = DateTime.UtcNow;

        await _assetRepository.UpdateAsync(asset);

        await _auditLogService.LogActionAsync("Transfer", "Asset", asset.Id!, oldValue, asset);

        return MapToResponse(asset);
    }

    public async Task<AssetResponse> ReturnAsync(ReturnAssetRequest request)
    {
        var asset = await _assetRepository.GetByIdAsync(request.AssetId);

        if (asset == null)
            throw new Exception("Asset not found.");

        if (asset.Status != "Allocated")
            throw new Exception("Only allocated assets can be returned.");

        var oldValue = CloneAsset(asset);

        asset.AssignedEmployeeId = null;
        asset.Status = "Available";
        asset.Condition = request.Condition;
        asset.UpdatedAt = DateTime.UtcNow;

        await _assetRepository.UpdateAsync(asset);

        await _auditLogService.LogActionAsync("Return", "Asset", asset.Id!, oldValue, asset);

        return MapToResponse(asset);
    }

    public async Task<PagedResponse<AssetResponse>> SearchAdvancedAsync(SearchAssetsRequest request)
    {
        var (items, totalCount) = await _assetRepository.SearchAdvancedAsync(
            request.SearchTerm,
            request.CategoryId,
            request.Status,
            request.LocationId,
            request.DepartmentId,
            request.VendorId,
            request.Condition,
            request.WarrantyExpiryBefore,
            request.PurchaseDateAfter,
            request.SortBy,
            request.IsDescending,
            request.PageNumber,
            request.PageSize);

        var totalPages = (int)Math.Ceiling((double)totalCount / request.PageSize);

        return new PagedResponse<AssetResponse>
        {
            Items = items.Select(MapToResponse).ToList(),
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            TotalPages = totalPages,
            TotalCount = totalCount
        };
    }

    private static Asset CloneAsset(Asset asset)
    {
        return new Asset
        {
            Id = asset.Id,
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
            ImageUrls = asset.ImageUrls.ToList(),
            InvoiceDocument = asset.InvoiceDocument,
            IsDeleted = asset.IsDeleted,
            CreatedAt = asset.CreatedAt,
            UpdatedAt = asset.UpdatedAt
        };
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
