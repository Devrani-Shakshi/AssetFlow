namespace AssetFlow.Application.Features.Dashboard.DTOs;

public class CategorySummaryResponse
{
    public string CategoryName { get; set; } = string.Empty;

    public int AssetCount { get; set; }
}
