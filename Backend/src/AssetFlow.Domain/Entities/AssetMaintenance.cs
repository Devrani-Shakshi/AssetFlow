using System;

namespace AssetFlow.Domain.Entities;

public class AssetMaintenance : BaseEntity
{
    public string AssetId { get; set; } = string.Empty;

    public string VendorId { get; set; } = string.Empty;

    public DateTime MaintenanceDate { get; set; }

    public string MaintenanceType { get; set; } = string.Empty;

    public string? Description { get; set; }

    public decimal Cost { get; set; }

    public string Status { get; set; } = "Scheduled"; // Scheduled, In Progress, Completed, Cancelled

    public DateTime? ExpectedCompletionDate { get; set; }

    public DateTime? CompletedDate { get; set; }

    public string? Remarks { get; set; }
}
