using System;

namespace AssetFlow.Domain.Entities;

public class Allocation : BaseEntity
{
    public string AssetId { get; set; } = string.Empty;

    public string EmployeeId { get; set; } = string.Empty;

    public string DepartmentId { get; set; } = string.Empty;

    public string AllocatedBy { get; set; } = string.Empty;

    public DateTime AllocatedDate { get; set; } = DateTime.UtcNow;

    public string? Remarks { get; set; }

    public string Status { get; set; } = "Allocated"; // e.g., Allocated, Returned, Transferred
}
