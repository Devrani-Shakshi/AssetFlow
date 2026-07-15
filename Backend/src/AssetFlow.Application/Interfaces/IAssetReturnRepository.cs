using AssetFlow.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AssetFlow.Application.Interfaces;

public interface IAssetReturnRepository
{
    Task CreateAsync(AssetReturn assetReturn);

    Task<AssetReturn?> GetByIdAsync(string id);

    Task<List<AssetReturn>> GetHistoryByAssetIdAsync(string assetId);

    Task<List<AssetReturn>> GetAllAsync();
}
