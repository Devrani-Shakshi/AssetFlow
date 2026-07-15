namespace AssetFlow.Domain.Entities;

public class Department : BaseEntity
{
    public string Code { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string? ManagerId { get; set; }

    public bool IsActive { get; set; } = true;
}