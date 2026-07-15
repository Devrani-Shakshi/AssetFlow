using AssetFlow.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AssetFlow.Application.Interfaces;

public interface IAssetRepository
{
    Task CreateAsync(Asset asset);

    Task UpdateAsync(Asset asset);

    Task<bool> DeleteAsync(string id);

    Task<Asset?> GetByIdAsync(string id);

    Task<List<Asset>> GetAllAsync();

    Task<Asset?> GetByAssetCodeAsync(string assetCode);

    Task<List<Asset>> SearchAndFilterAsync(string? searchTerm, string? categoryId, string? status, string? locationId);

    Task<(List<Asset> Items, long TotalCount)> SearchAdvancedAsync(
        string? searchTerm,
        string? categoryId,
        string? status,
        string? locationId,
        string? departmentId,
        string? vendorId,
        string? condition,
        System.DateTime? warrantyExpiryBefore,
        System.DateTime? purchaseDateAfter,
        string? sortBy,
        bool isDescending,
        int pageNumber,
        int pageSize);
}
