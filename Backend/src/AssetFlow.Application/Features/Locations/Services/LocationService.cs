using AssetFlow.Application.Features.Locations.DTOs;
using AssetFlow.Application.Features.Locations.Interfaces;
using AssetFlow.Application.Interfaces;
using AssetFlow.Domain.Entities;

namespace AssetFlow.Application.Features.Locations.Services;

public class LocationService : ILocationService
{
    private readonly ILocationRepository _locationRepository;

    public LocationService(ILocationRepository locationRepository)
    {
        _locationRepository = locationRepository;
    }

    public async Task<LocationResponse> CreateAsync(CreateLocationRequest request)
    {
        var existingCode = await _locationRepository.GetByLocationCodeAsync(request.LocationCode);

        if (existingCode != null)
            throw new Exception("Location code already exists.");

        var location = new Location
        {
            LocationCode = request.LocationCode,
            LocationName = request.LocationName,
            Building = request.Building,
            Floor = request.Floor,
            Room = request.Room,
            Description = request.Description,
            IsActive = true
        };

        await _locationRepository.CreateAsync(location);

        return new LocationResponse
        {
            Id = location.Id!,
            LocationCode = location.LocationCode,
            LocationName = location.LocationName,
            Building = location.Building,
            Floor = location.Floor,
            Room = location.Room,
            Description = location.Description,
            IsActive = location.IsActive
        };
    }

    public async Task<List<LocationResponse>> GetAllAsync()
    {
        var locations = await _locationRepository.GetAllAsync();

        return locations.Select(l => new LocationResponse
        {
            Id = l.Id!,
            LocationCode = l.LocationCode,
            LocationName = l.LocationName,
            Building = l.Building,
            Floor = l.Floor,
            Room = l.Room,
            Description = l.Description,
            IsActive = l.IsActive
        }).ToList();
    }

    public async Task<LocationResponse?> GetByIdAsync(string id)
    {
        var location = await _locationRepository.GetByIdAsync(id);

        if (location == null)
            return null;

        return new LocationResponse
        {
            Id = location.Id!,
            LocationCode = location.LocationCode,
            LocationName = location.LocationName,
            Building = location.Building,
            Floor = location.Floor,
            Room = location.Room,
            Description = location.Description,
            IsActive = location.IsActive
        };
    }

    public async Task<LocationResponse> UpdateAsync(UpdateLocationRequest request)
    {
        var location = await _locationRepository.GetByIdAsync(request.Id);

        if (location == null)
            throw new Exception("Location not found.");

        location.LocationCode = request.LocationCode;
        location.LocationName = request.LocationName;
        location.Building = request.Building;
        location.Floor = request.Floor;
        location.Room = request.Room;
        location.Description = request.Description;
        location.IsActive = request.IsActive;
        location.UpdatedAt = DateTime.UtcNow;

        await _locationRepository.UpdateAsync(location);

        return new LocationResponse
        {
            Id = location.Id!,
            LocationCode = location.LocationCode,
            LocationName = location.LocationName,
            Building = location.Building,
            Floor = location.Floor,
            Room = location.Room,
            Description = location.Description,
            IsActive = location.IsActive
        };
    }

    public async Task<bool> DeleteAsync(string id)
    {
        return await _locationRepository.DeleteAsync(id);
    }
}
