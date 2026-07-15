using AssetFlow.Application.Features.Locations.DTOs;

namespace AssetFlow.Application.Features.Locations.Interfaces;

public interface ILocationService
{
    Task<LocationResponse> CreateAsync(CreateLocationRequest request);

    Task<List<LocationResponse>> GetAllAsync();

    Task<LocationResponse?> GetByIdAsync(string id);

    Task<LocationResponse> UpdateAsync(UpdateLocationRequest request);

    Task<bool> DeleteAsync(string id);
}
