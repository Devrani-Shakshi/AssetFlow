namespace AssetFlow.Domain.Entities;

public class AssetCategory : BaseEntity
{
    public string CategoryCode { get; set; } = string.Empty;

    public string CategoryName { get; set; } = string.Empty;

    public string? Description { get; set; }

    public decimal DepreciationRate { get; set; }

    public int UsefulLifeYears { get; set; }

    public bool IsActive { get; set; } = true;
}
