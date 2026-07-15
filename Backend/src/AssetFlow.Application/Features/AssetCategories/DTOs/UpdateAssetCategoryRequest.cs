namespace AssetFlow.Application.Features.AssetCategories.DTOs;

public class UpdateAssetCategoryRequest
{
    public string Id { get; set; } = string.Empty;

    public string CategoryCode { get; set; } = string.Empty;

    public string CategoryName { get; set; } = string.Empty;

    public string? Description { get; set; }

    public decimal DepreciationRate { get; set; }

    public int UsefulLifeYears { get; set; }

    public bool IsActive { get; set; }
}
