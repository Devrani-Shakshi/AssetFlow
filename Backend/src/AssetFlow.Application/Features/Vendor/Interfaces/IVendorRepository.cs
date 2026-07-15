using AssetFlow.Application.Features.Vendors.DTOs;

namespace AssetFlow.Application.Features.Vendors.Interfaces;

public interface IVendorService
{
    Task<VendorResponse> CreateAsync(CreateVendorRequest request);

    Task<List<VendorResponse>> GetAllAsync();

    Task<VendorResponse?> GetByIdAsync(string id);

    Task<VendorResponse> UpdateAsync(UpdateVendorRequest request);

    Task<bool> DeleteAsync(string id);
}