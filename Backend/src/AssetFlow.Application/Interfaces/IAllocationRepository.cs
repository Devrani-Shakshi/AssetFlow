using AssetFlow.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AssetFlow.Application.Interfaces;

public interface IAllocationRepository
{
    Task CreateAsync(Allocation allocation);

    Task UpdateAsync(Allocation allocation);

    Task<Allocation?> GetByIdAsync(string id);

    Task<List<Allocation>> GetHistoryByAssetIdAsync(string assetId);

    Task<Allocation?> GetCurrentAllocationByAssetIdAsync(string assetId);

    Task<List<Allocation>> GetAllAsync();
}
