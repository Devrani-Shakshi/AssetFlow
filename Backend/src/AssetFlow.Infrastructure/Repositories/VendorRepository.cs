using AssetFlow.Application.Interfaces;
using AssetFlow.Domain.Entities;
using AssetFlow.Infrastructure.Mongo;
using MongoDB.Driver;

namespace AssetFlow.Infrastructure.Repositories;

public class VendorRepository : IVendorRepository
{
    private readonly IMongoCollection<Vendor> _vendors;

    public VendorRepository(MongoDbContext context)
    {
        _vendors = context.Database.GetCollection<Vendor>("Vendors");
    }

    public async Task CreateAsync(Vendor vendor)
    {
        await _vendors.InsertOneAsync(vendor);
    }

    public async Task UpdateAsync(Vendor vendor)
    {
        await _vendors.ReplaceOneAsync(x => x.Id == vendor.Id, vendor);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var vendor = await GetByIdAsync(id);

        if (vendor == null)
            return false;

        vendor.IsDeleted = true;
        vendor.UpdatedAt = DateTime.UtcNow;

        await UpdateAsync(vendor);

        return true;
    }

    public async Task<Vendor?> GetByIdAsync(string id)
    {
        return await _vendors
            .Find(x => x.Id == id && !x.IsDeleted)
            .FirstOrDefaultAsync();
    }

    public async Task<List<Vendor>> GetAllAsync()
    {
        return await _vendors
            .Find(x => !x.IsDeleted)
            .ToListAsync();
    }

    public async Task<Vendor?> GetByEmailAsync(string email)
    {
        return await _vendors
            .Find(x => x.Email == email && !x.IsDeleted)
            .FirstOrDefaultAsync();
    }

    public async Task<Vendor?> GetByVendorCodeAsync(string vendorCode)
    {
        return await _vendors
            .Find(x => x.VendorCode == vendorCode && !x.IsDeleted)
            .FirstOrDefaultAsync();
    }
}