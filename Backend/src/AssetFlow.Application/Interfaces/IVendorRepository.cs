using AssetFlow.Domain.Entities;

namespace AssetFlow.Application.Interfaces;

public interface IVendorRepository
{
    Task CreateAsync(Vendor vendor);

    Task UpdateAsync(Vendor vendor);

    Task<bool> DeleteAsync(string id);

    Task<Vendor?> GetByIdAsync(string id);

    Task<List<Vendor>> GetAllAsync();

    Task<Vendor?> GetByEmailAsync(string email);

    Task<Vendor?> GetByVendorCodeAsync(string vendorCode);
}