using AssetFlow.Application.Features.Assets.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AssetFlow.Application.Features.Assets.Interfaces;

public interface IAssetService
{
    Task<AssetResponse> CreateAsync(CreateAssetRequest request);

    Task<List<AssetResponse>> GetAllAsync();

    Task<AssetResponse?> GetByIdAsync(string id);

    Task<AssetResponse> UpdateAsync(UpdateAssetRequest request);

    Task<bool> DeleteAsync(string id);

    Task<List<AssetResponse>> SearchAndFilterAsync(string? searchTerm, string? categoryId, string? status, string? locationId);

    Task<AssetResponse> AssignAsync(AssignAssetRequest request);

    Task<AssetResponse> TransferAsync(TransferAssetRequest request);

    Task<AssetResponse> ReturnAsync(ReturnAssetRequest request);

    Task<PagedResponse<AssetResponse>> SearchAdvancedAsync(SearchAssetsRequest request);
}
