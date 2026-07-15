using System;

namespace AssetFlow.Application.Features.Assets.DTOs;

public class SearchAssetsRequest
{
    public string? SearchTerm { get; set; }

    public string? CategoryId { get; set; }

    public string? Status { get; set; }

    public string? LocationId { get; set; }

    public string? DepartmentId { get; set; }

    public string? VendorId { get; set; }

    public string? Condition { get; set; }

    public DateTime? WarrantyExpiryBefore { get; set; }

    public DateTime? PurchaseDateAfter { get; set; }

    public string? SortBy { get; set; } // e.g. "AssetName", "PurchaseCost", "PurchaseDate"

    public bool IsDescending { get; set; } = false;

    public int PageNumber { get; set; } = 1;

    public int PageSize { get; set; } = 10;
}
