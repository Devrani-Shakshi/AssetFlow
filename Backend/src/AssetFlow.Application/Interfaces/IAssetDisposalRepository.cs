using AssetFlow.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AssetFlow.Application.Interfaces;

public interface IAssetDisposalRepository
{
    Task CreateAsync(AssetDisposal disposal);

    Task UpdateAsync(AssetDisposal disposal);

    Task<bool> DeleteAsync(string id);

    Task<AssetDisposal?> GetByIdAsync(string id);

    Task<List<AssetDisposal>> GetAllAsync();

    Task<AssetDisposal?> GetByAssetIdAsync(string assetId);
}
