using AssetFlow.Application.Features.Vendors.DTOs;
using AssetFlow.Application.Features.Vendors.Interfaces;
using AssetFlow.Application.Interfaces;
using AssetFlow.Domain.Entities;

namespace AssetFlow.Application.Features.Vendors.Services;

public class VendorService : IVendorService
{
    private readonly IVendorRepository _vendorRepository;

    public VendorService(IVendorRepository vendorRepository)
    {
        _vendorRepository = vendorRepository;
    }

   public async Task<VendorResponse> CreateAsync(CreateVendorRequest request)
{
    var existingEmail = await _vendorRepository.GetByEmailAsync(request.Email);

    if (existingEmail != null)
        throw new Exception("Vendor email already exists.");

    var existingCode = await _vendorRepository.GetByVendorCodeAsync(request.VendorCode);

    if (existingCode != null)
        throw new Exception("Vendor code already exists.");

    var vendor = new Vendor
    {
        VendorCode = request.VendorCode,
        VendorName = request.VendorName,
        ContactPerson = request.ContactPerson,
        Email = request.Email,
        PhoneNumber = request.PhoneNumber,
        GSTNumber = request.GSTNumber,
        Address = request.Address,
        City = request.City,
        State = request.State,
        Country = request.Country,
        PostalCode = request.PostalCode,
        Website = request.Website,
        IsActive = true
    };

    await _vendorRepository.CreateAsync(vendor);

    return new VendorResponse
    {
        Id = vendor.Id!,
        VendorCode = vendor.VendorCode,
        VendorName = vendor.VendorName,
        ContactPerson = vendor.ContactPerson,
        Email = vendor.Email,
        PhoneNumber = vendor.PhoneNumber,
        GSTNumber = vendor.GSTNumber,
        Address = vendor.Address,
        City = vendor.City,
        State = vendor.State,
        Country = vendor.Country,
        PostalCode = vendor.PostalCode,
        Website = vendor.Website,
        IsActive = vendor.IsActive
    };
}

   public async Task<List<VendorResponse>> GetAllAsync()
{
    var vendors = await _vendorRepository.GetAllAsync();

    return vendors.Select(v => new VendorResponse
    {
        Id = v.Id!,
        VendorCode = v.VendorCode,
        VendorName = v.VendorName,
        ContactPerson = v.ContactPerson,
        Email = v.Email,
        PhoneNumber = v.PhoneNumber,
        GSTNumber = v.GSTNumber,
        Address = v.Address,
        City = v.City,
        State = v.State,
        Country = v.Country,
        PostalCode = v.PostalCode,
        Website = v.Website,
        IsActive = v.IsActive
    }).ToList();
}

   public async Task<VendorResponse?> GetByIdAsync(string id)
{
    var vendor = await _vendorRepository.GetByIdAsync(id);

    if (vendor == null)
        return null;

    return new VendorResponse
    {
        Id = vendor.Id!,
        VendorCode = vendor.VendorCode,
        VendorName = vendor.VendorName,
        ContactPerson = vendor.ContactPerson,
        Email = vendor.Email,
        PhoneNumber = vendor.PhoneNumber,
        GSTNumber = vendor.GSTNumber,
        Address = vendor.Address,
        City = vendor.City,
        State = vendor.State,
        Country = vendor.Country,
        PostalCode = vendor.PostalCode,
        Website = vendor.Website,
        IsActive = vendor.IsActive
    };
}

public async Task<VendorResponse> UpdateAsync(UpdateVendorRequest request)
{
    var vendor = await _vendorRepository.GetByIdAsync(request.Id);

    if (vendor == null)
        throw new Exception("Vendor not found.");

    vendor.VendorCode = request.VendorCode;
    vendor.VendorName = request.VendorName;
    vendor.ContactPerson = request.ContactPerson;
    vendor.Email = request.Email;
    vendor.PhoneNumber = request.PhoneNumber;
    vendor.GSTNumber = request.GSTNumber;
    vendor.Address = request.Address;
    vendor.City = request.City;
    vendor.State = request.State;
    vendor.Country = request.Country;
    vendor.PostalCode = request.PostalCode;
    vendor.Website = request.Website;
    vendor.IsActive = request.IsActive;
    vendor.UpdatedAt = DateTime.UtcNow;

    await _vendorRepository.UpdateAsync(vendor);

    return new VendorResponse
    {
        Id = vendor.Id!,
        VendorCode = vendor.VendorCode,
        VendorName = vendor.VendorName,
        ContactPerson = vendor.ContactPerson,
        Email = vendor.Email,
        PhoneNumber = vendor.PhoneNumber,
        GSTNumber = vendor.GSTNumber,
        Address = vendor.Address,
        City = vendor.City,
        State = vendor.State,
        Country = vendor.Country,
        PostalCode = vendor.PostalCode,
        Website = vendor.Website,
        IsActive = vendor.IsActive
    };
}

 public async Task<bool> DeleteAsync(string id)
{
    return await _vendorRepository.DeleteAsync(id);
}
}