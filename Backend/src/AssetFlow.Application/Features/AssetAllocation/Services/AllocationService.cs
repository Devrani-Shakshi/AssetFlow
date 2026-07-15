using AssetFlow.Application.Features.AssetAllocation.DTOs;
using AssetFlow.Application.Features.AssetAllocation.Interfaces;
using AssetFlow.Application.Interfaces;
using AssetFlow.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AssetFlow.Application.Features.AssetAllocation.Services;

public class AllocationService : IAllocationService
{
    private readonly IAllocationRepository _allocationRepository;
    private readonly IAssetRepository _assetRepository;

    public AllocationService(IAllocationRepository allocationRepository, IAssetRepository assetRepository)
    {
        _allocationRepository = allocationRepository;
        _assetRepository = assetRepository;
    }

    public async Task<AllocationResponse> AllocateAsync(AllocateAssetRequest request)
    {
        // 1. Get the asset and check availability
        var asset = await _assetRepository.GetByIdAsync(request.AssetId);

        if (asset == null)
            throw new Exception("Asset not found.");

        if (asset.Status != "Available")
            throw new Exception("Asset is not available for allocation.");

        // 2. Mark existing active allocation as returned or transferred if any (defensive check)
        var currentAllocation = await _allocationRepository.GetCurrentAllocationByAssetIdAsync(request.AssetId);
        if (currentAllocation != null)
        {
            currentAllocation.Status = "Transferred";
            currentAllocation.UpdatedAt = DateTime.UtcNow;
            await _allocationRepository.UpdateAsync(currentAllocation);
        }

        // 3. Create allocation record
        var allocation = new Allocation
        {
            AssetId = request.AssetId,
            EmployeeId = request.EmployeeId,
            DepartmentId = request.DepartmentId,
            AllocatedBy = request.AllocatedBy,
            AllocatedDate = DateTime.UtcNow,
            Remarks = request.Remarks,
            Status = "Allocated"
        };

        await _allocationRepository.CreateAsync(allocation);

        // 4. Update asset status
        asset.AssignedEmployeeId = request.EmployeeId;
        asset.Status = "Allocated";
        asset.UpdatedAt = DateTime.UtcNow;
        await _assetRepository.UpdateAsync(asset);

        return MapToResponse(allocation);
    }

    public async Task<List<AllocationResponse>> GetHistoryByAssetIdAsync(string assetId)
    {
        var history = await _allocationRepository.GetHistoryByAssetIdAsync(assetId);

        return history.Select(MapToResponse).ToList();
    }

    public async Task<AllocationResponse?> GetCurrentAllocationByAssetIdAsync(string assetId)
    {
        var allocation = await _allocationRepository.GetCurrentAllocationByAssetIdAsync(assetId);

        if (allocation == null)
            return null;

        return MapToResponse(allocation);
    }

    public async Task<List<AllocationResponse>> GetAllAsync()
    {
        var allocations = await _allocationRepository.GetAllAsync();

        return allocations.Select(MapToResponse).ToList();
    }

    private static AllocationResponse MapToResponse(Allocation allocation)
    {
        return new AllocationResponse
        {
            Id = allocation.Id!,
            AssetId = allocation.AssetId,
            EmployeeId = allocation.EmployeeId,
            DepartmentId = allocation.DepartmentId,
            AllocatedBy = allocation.AllocatedBy,
            AllocatedDate = allocation.AllocatedDate,
            Remarks = allocation.Remarks,
            Status = allocation.Status
        };
    }
}
