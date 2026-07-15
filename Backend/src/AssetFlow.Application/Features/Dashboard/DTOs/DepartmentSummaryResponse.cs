namespace AssetFlow.Application.Features.Dashboard.DTOs;

public class DepartmentSummaryResponse
{
    public string DepartmentName { get; set; } = string.Empty;

    public int AssetCount { get; set; }
}
