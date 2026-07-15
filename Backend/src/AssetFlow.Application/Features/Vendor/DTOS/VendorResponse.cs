namespace AssetFlow.Application.Features.Vendors.DTOs;

public class VendorResponse
{
    public string Id { get; set; } = string.Empty;

    public string VendorCode { get; set; } = string.Empty;

    public string VendorName { get; set; } = string.Empty;

    public string ContactPerson { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public string GSTNumber { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public string State { get; set; } = string.Empty;

    public string Country { get; set; } = string.Empty;

    public string PostalCode { get; set; } = string.Empty;

    public string Website { get; set; } = string.Empty;

    public bool IsActive { get; set; }
}