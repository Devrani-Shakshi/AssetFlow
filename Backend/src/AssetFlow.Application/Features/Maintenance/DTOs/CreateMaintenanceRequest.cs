using System;

namespace AssetFlow.Application.Features.Maintenance.DTOs;

public class CreateMaintenanceRequest
{
    public string AssetId { get; set; } = string.Empty;

    public string VendorId { get; set; } = string.Empty;

    public DateTime MaintenanceDate { get; set; }

    public string MaintenanceType { get; set; } = string.Empty;

    public string? Description { get; set; }

    public decimal Cost { get; set; }

    public DateTime? ExpectedCompletionDate { get; set; }

    public string? Remarks { get; set; }
}
