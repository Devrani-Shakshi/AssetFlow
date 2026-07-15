using AssetFlow.Application.Features.AssetReturn.DTOs;
using AssetFlow.Application.Features.AssetReturn.Interfaces;
using AssetFlow.Application.Interfaces;
using AssetFlow.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AssetFlow.Application.Features.AssetReturn.Services;

public class AssetReturnService : IAssetReturnService
{
    private readonly IAssetReturnRepository _returnRepository;
    private readonly IAllocationRepository _allocationRepository;
    private readonly IAssetRepository _assetRepository;

    public AssetReturnService(
        IAssetReturnRepository returnRepository,
        IAllocationRepository allocationRepository,
        IAssetRepository assetRepository)
    {
        _returnRepository = returnRepository;
        _allocationRepository = allocationRepository;
        _assetRepository = assetRepository;
    }

    public async Task<AssetReturnResponse> ReturnAsync(ProcessReturnRequest request)
    {
        // 1. Get the asset and check status
        var asset = await _assetRepository.GetByIdAsync(request.AssetId);

        if (asset == null)
            throw new Exception("Asset not found.");

        if (asset.Status != "Allocated")
            throw new Exception("Asset is not currently allocated.");

        // 2. Resolve current allocation and mark as Returned
        var currentAllocation = await _allocationRepository.GetCurrentAllocationByAssetIdAsync(request.AssetId);
        if (currentAllocation != null)
        {
            currentAllocation.Status = "Returned";
            currentAllocation.UpdatedAt = DateTime.UtcNow;
            await _allocationRepository.UpdateAsync(currentAllocation);
        }

        // 3. Create the return record
        var assetReturn = new AssetFlow.Domain.Entities.AssetReturn
        {
            AssetId = request.AssetId,
            EmployeeId = request.EmployeeId,
            ReturnDate = DateTime.UtcNow,
            Condition = request.Condition,
            Remarks = request.Remarks,
            ReceivedBy = request.ReceivedBy
        };

        await _returnRepository.CreateAsync(assetReturn);

        // 4. Update asset status
        asset.AssignedEmployeeId = null;
        asset.Status = "Available";
        asset.Condition = request.Condition;
        asset.UpdatedAt = DateTime.UtcNow;
        await _assetRepository.UpdateAsync(asset);

        return MapToResponse(assetReturn);
    }

    public async Task<List<AssetReturnResponse>> GetHistoryByAssetIdAsync(string assetId)
    {
        var history = await _returnRepository.GetHistoryByAssetIdAsync(assetId);

        return history.Select(MapToResponse).ToList();
    }

    public async Task<List<AssetReturnResponse>> GetAllAsync()
    {
        var returns = await _returnRepository.GetAllAsync();

        return returns.Select(MapToResponse).ToList();
    }

    private static AssetReturnResponse MapToResponse(AssetFlow.Domain.Entities.AssetReturn assetReturn)
    {
        return new AssetReturnResponse
        {
            Id = assetReturn.Id!,
            AssetId = assetReturn.AssetId,
            EmployeeId = assetReturn.EmployeeId,
            ReturnDate = assetReturn.ReturnDate,
            Condition = assetReturn.Condition,
            Remarks = assetReturn.Remarks,
            ReceivedBy = assetReturn.ReceivedBy
        };
    }
}
