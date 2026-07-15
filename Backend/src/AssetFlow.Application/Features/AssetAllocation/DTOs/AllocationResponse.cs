using System;

namespace AssetFlow.Application.Features.AssetAllocation.DTOs;

public class AllocationResponse
{
    public string Id { get; set; } = string.Empty;

    public string AssetId { get; set; } = string.Empty;

    public string EmployeeId { get; set; } = string.Empty;

    public string DepartmentId { get; set; } = string.Empty;

    public string AllocatedBy { get; set; } = string.Empty;

    public DateTime AllocatedDate { get; set; }

    public string? Remarks { get; set; }

    public string Status { get; set; } = string.Empty;
}
