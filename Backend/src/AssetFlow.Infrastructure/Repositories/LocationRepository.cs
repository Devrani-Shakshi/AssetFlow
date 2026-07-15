using AssetFlow.Application.Interfaces;
using AssetFlow.Domain.Entities;
using AssetFlow.Infrastructure.Mongo;
using MongoDB.Driver;

namespace AssetFlow.Infrastructure.Repositories;

public class LocationRepository : ILocationRepository
{
    private readonly IMongoCollection<Location> _locations;

    public LocationRepository(MongoDbContext context)
    {
        _locations = context.Locations;
    }

    public async Task CreateAsync(Location location)
    {
        await _locations.InsertOneAsync(location);
    }

    public async Task UpdateAsync(Location location)
    {
        await _locations.ReplaceOneAsync(x => x.Id == location.Id, location);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var location = await GetByIdAsync(id);

        if (location == null)
            return false;

        location.IsDeleted = true;
        location.UpdatedAt = DateTime.UtcNow;

        await UpdateAsync(location);

        return true;
    }

    public async Task<Location?> GetByIdAsync(string id)
    {
        return await _locations
            .Find(x => x.Id == id && !x.IsDeleted)
            .FirstOrDefaultAsync();
    }

    public async Task<List<Location>> GetAllAsync()
    {
        return await _locations
            .Find(x => !x.IsDeleted)
            .ToListAsync();
    }

    public async Task<Location?> GetByLocationCodeAsync(string locationCode)
    {
        return await _locations
            .Find(x => x.LocationCode == locationCode && !x.IsDeleted)
            .FirstOrDefaultAsync();
    }
}
