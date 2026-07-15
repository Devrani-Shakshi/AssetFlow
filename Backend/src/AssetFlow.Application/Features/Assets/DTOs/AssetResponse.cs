using System;
using System.Collections.Generic;

namespace AssetFlow.Application.Features.Assets.DTOs;

public class AssetResponse
{
    public string Id { get; set; } = string.Empty;

    public string AssetCode { get; set; } = string.Empty;

    public string AssetName { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string? SerialNumber { get; set; }

    public string? Barcode { get; set; }

    public string? QRCode { get; set; }

    public string CategoryId { get; set; } = string.Empty;

    public string VendorId { get; set; } = string.Empty;

    public string DepartmentId { get; set; } = string.Empty;

    public string? AssignedEmployeeId { get; set; }

    public string LocationId { get; set; } = string.Empty;

    public DateTime PurchaseDate { get; set; }

    public decimal PurchaseCost { get; set; }

    public DateTime? WarrantyStart { get; set; }

    public DateTime? WarrantyEnd { get; set; }

    public decimal DepreciationRate { get; set; }

    public decimal CurrentValue { get; set; }

    public string Condition { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;

    public string? Notes { get; set; }

    public List<string> ImageUrls { get; set; } = new List<string>();

    public string? InvoiceDocument { get; set; }
}
