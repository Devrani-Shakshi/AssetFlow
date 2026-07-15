using AssetFlow.Application.Features.AssetReturn.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AssetFlow.Application.Features.AssetReturn.Interfaces;

public interface IAssetReturnService
{
    Task<AssetReturnResponse> ReturnAsync(ProcessReturnRequest request);

    Task<List<AssetReturnResponse>> GetHistoryByAssetIdAsync(string assetId);

    Task<List<AssetReturnResponse>> GetAllAsync();
}
