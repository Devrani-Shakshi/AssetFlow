using System.ComponentModel.DataAnnotations;

namespace AssetFlow.Application.Features.Departments.DTOs;

public class UpdateDepartmentRequest
{
    [Required]
    public string Id { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Code { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    public string? ManagerId { get; set; }

    public bool IsActive { get; set; }
}