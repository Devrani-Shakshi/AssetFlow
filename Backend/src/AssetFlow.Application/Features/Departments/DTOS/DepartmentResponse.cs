namespace AssetFlow.Application.Features.Departments.DTOs;

public class DepartmentResponse
{
    public string Id { get; set; } = string.Empty;

    public string Code { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string? ManagerId { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }
}