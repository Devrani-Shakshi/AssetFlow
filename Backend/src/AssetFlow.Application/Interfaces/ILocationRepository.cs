using AssetFlow.Domain.Entities;

namespace AssetFlow.Application.Interfaces;

public interface ILocationRepository
{
    Task CreateAsync(Location location);

    Task UpdateAsync(Location location);

    Task<bool> DeleteAsync(string id);

    Task<Location?> GetByIdAsync(string id);

    Task<List<Location>> GetAllAsync();

    Task<Location?> GetByLocationCodeAsync(string locationCode);
}
