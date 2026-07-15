using AssetFlow.Application.Features.AssetAllocation.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AssetFlow.Application.Features.AssetAllocation.Interfaces;

public interface IAllocationService
{
    Task<AllocationResponse> AllocateAsync(AllocateAssetRequest request);

    Task<List<AllocationResponse>> GetHistoryByAssetIdAsync(string assetId);

    Task<AllocationResponse?> GetCurrentAllocationByAssetIdAsync(string assetId);

    Task<List<AllocationResponse>> GetAllAsync();
}
