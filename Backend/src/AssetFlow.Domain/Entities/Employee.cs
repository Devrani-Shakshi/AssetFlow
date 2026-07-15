using AssetFlow.Domain.Enums;

namespace AssetFlow.Domain.Entities;

public class Employee : BaseEntity
{
    public string EmployeeCode { get; set; } = string.Empty;

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public string DepartmentId { get; set; } = string.Empty;

    public string Designation { get; set; } = string.Empty;

    public DateTime JoiningDate { get; set; }

    public string? ManagerId { get; set; }

    public EmployeeStatus Status { get; set; } = EmployeeStatus.Active;
}