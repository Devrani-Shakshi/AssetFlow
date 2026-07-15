using AssetFlow.Application.Features.AssetDisposal.DTOs;
using AssetFlow.Application.Features.AssetDisposal.Interfaces;
using AssetFlow.Application.Interfaces;
using AssetFlow.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AssetFlow.Application.Features.AssetDisposal.Services;

public class AssetDisposalService : IAssetDisposalService
{
    private readonly IAssetDisposalRepository _disposalRepository;
    private readonly IAssetRepository _assetRepository;

    public AssetDisposalService(IAssetDisposalRepository disposalRepository, IAssetRepository assetRepository)
    {
        _disposalRepository = disposalRepository;
        _assetRepository = assetRepository;
    }

    public async Task<DisposalResponse> CreateAsync(CreateDisposalRequest request)
    {
        var asset = await _assetRepository.GetByIdAsync(request.AssetId);
        if (asset == null)
            throw new Exception("Asset not found.");

        if (asset.Status.Equals("Disposed", StringComparison.OrdinalIgnoreCase))
            throw new Exception("Asset is already disposed.");

        var disposal = new AssetFlow.Domain.Entities.AssetDisposal
        {
            AssetId = request.AssetId,
            DisposalDate = request.DisposalDate,
            Reason = request.Reason,
            DisposalMethod = request.DisposalMethod,
            AmountRecovered = request.AmountRecovered,
            ApprovedBy = request.ApprovedBy,
            Remarks = request.Remarks
        };

        await _disposalRepository.CreateAsync(disposal);

        // Update the asset status to Disposed and clear employee assignment
        asset.Status = "Disposed";
        asset.AssignedEmployeeId = null;
        asset.UpdatedAt = DateTime.UtcNow;
        await _assetRepository.UpdateAsync(asset);

        return MapToResponse(disposal);
    }

    public async Task<List<DisposalResponse>> GetAllAsync()
    {
        var list = await _disposalRepository.GetAllAsync();
        return list.Select(MapToResponse).ToList();
    }

    public async Task<DisposalResponse?> GetByIdAsync(string id)
    {
        var disposal = await _disposalRepository.GetByIdAsync(id);
        if (disposal == null)
            return null;

        return MapToResponse(disposal);
    }

    public async Task<DisposalResponse> UpdateAsync(UpdateDisposalRequest request)
    {
        var disposal = await _disposalRepository.GetByIdAsync(request.Id);
        if (disposal == null)
            throw new Exception("Disposal record not found.");

        var asset = await _assetRepository.GetByIdAsync(request.AssetId);
        if (asset == null)
            throw new Exception("Asset not found.");

        disposal.AssetId = request.AssetId;
        disposal.DisposalDate = request.DisposalDate;
        disposal.Reason = request.Reason;
        disposal.DisposalMethod = request.DisposalMethod;
        disposal.AmountRecovered = request.AmountRecovered;
        disposal.ApprovedBy = request.ApprovedBy;
        disposal.Remarks = request.Remarks;
        disposal.UpdatedAt = DateTime.UtcNow;

        await _disposalRepository.UpdateAsync(disposal);

        return MapToResponse(disposal);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var disposal = await _disposalRepository.GetByIdAsync(id);
        if (disposal == null)
            return false;

        // If deletion is requested, revert asset status to Available
        var asset = await _assetRepository.GetByIdAsync(disposal.AssetId);
        if (asset != null && asset.Status.Equals("Disposed", StringComparison.OrdinalIgnoreCase))
        {
            asset.Status = "Available";
            asset.UpdatedAt = DateTime.UtcNow;
            await _assetRepository.UpdateAsync(asset);
        }

        return await _disposalRepository.DeleteAsync(id);
    }

    private static DisposalResponse MapToResponse(AssetFlow.Domain.Entities.AssetDisposal d)
    {
        return new DisposalResponse
        {
            Id = d.Id!,
            AssetId = d.AssetId,
            DisposalDate = d.DisposalDate,
            Reason = d.Reason,
            DisposalMethod = d.DisposalMethod,
            AmountRecovered = d.AmountRecovered,
            ApprovedBy = d.ApprovedBy,
            Remarks = d.Remarks
        };
    }
}
