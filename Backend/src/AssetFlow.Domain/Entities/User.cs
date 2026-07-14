using AssetFlow.Domain.Enums;

namespace AssetFlow.Domain.Entities;

public class User : BaseEntity
{
    public string EmployeeCode { get; set; } = string.Empty;

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public string? DepartmentId { get; set; }

    public UserRole Role { get; set; } = UserRole.Employee;

    public UserStatus Status { get; set; } = UserStatus.Active;
}