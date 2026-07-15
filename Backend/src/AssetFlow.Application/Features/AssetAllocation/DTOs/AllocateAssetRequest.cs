namespace AssetFlow.Application.Features.AssetAllocation.DTOs;

public class AllocateAssetRequest
{
    public string AssetId { get; set; } = string.Empty;

    public string EmployeeId { get; set; } = string.Empty;

    public string DepartmentId { get; set; } = string.Empty;

    public string AllocatedBy { get; set; } = string.Empty;

    public string? Remarks { get; set; }
}
