namespace AssetFlow.Application.Features.Dashboard.DTOs;

public class DashboardSummaryResponse
{
    public int TotalAssets { get; set; }

    public int AssignedAssets { get; set; }

    public int AvailableAssets { get; set; }

    public int MaintenanceAssets { get; set; }

    public int DisposedAssets { get; set; }

    public int TotalEmployees { get; set; }

    public int TotalDepartments { get; set; }

    public int TotalVendors { get; set; }

    public int TotalCategories { get; set; }

    public int TotalLocations { get; set; }
}
