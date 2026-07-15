using System;

namespace AssetFlow.Application.Features.Maintenance.DTOs;

public class UpdateMaintenanceRequest
{
    public string Id { get; set; } = string.Empty;

    public string AssetId { get; set; } = string.Empty;

    public string VendorId { get; set; } = string.Empty;

    public DateTime MaintenanceDate { get; set; }

    public string MaintenanceType { get; set; } = string.Empty;

    public string? Description { get; set; }

    public decimal Cost { get; set; }

    public string Status { get; set; } = string.Empty;

    public DateTime? ExpectedCompletionDate { get; set; }

    public DateTime? CompletedDate { get; set; }

    public string? Remarks { get; set; }
}
