using AssetFlow.Application.Features.Employees.DTOs;
using AssetFlow.Application.Features.Employees.Interfaces;
using AssetFlow.Application.Interfaces;
using AssetFlow.Domain.Entities;
using AssetFlow.Domain.Enums;

namespace AssetFlow.Application.Features.Employees.Services;

public class EmployeeService : IEmployeeService
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IDepartmentRepository _departmentRepository;

    public EmployeeService(
        IEmployeeRepository employeeRepository,
        IDepartmentRepository departmentRepository)
    {
        _employeeRepository = employeeRepository;
        _departmentRepository = departmentRepository;
    }

public async Task<EmployeeResponse> CreateAsync(CreateEmployeeRequest request)
{
    // Check Department Exists
    var department = await _departmentRepository.GetByIdAsync(request.DepartmentId);

    if (department == null)
        throw new Exception("Department not found.");

    // Check Email
    var existingEmail = await _employeeRepository.GetByEmailAsync(request.Email);

    if (existingEmail != null)
        throw new Exception("Email already exists.");

    // Check Employee Code
    var existingCode = await _employeeRepository.GetByEmployeeCodeAsync(request.EmployeeCode);

    if (existingCode != null)
        throw new Exception("Employee Code already exists.");

    var employee = new Employee
    {
        EmployeeCode = request.EmployeeCode,
        FirstName = request.FirstName,
        LastName = request.LastName,
        Email = request.Email,
        PhoneNumber = request.PhoneNumber,
        DepartmentId = request.DepartmentId,
        Designation = request.Designation,
        JoiningDate = request.JoiningDate,
        ManagerId = request.ManagerId,
        Status = EmployeeStatus.Active
    };

    await _employeeRepository.CreateAsync(employee);

    return new EmployeeResponse
    {
        Id = employee.Id!,
        EmployeeCode = employee.EmployeeCode,
        FirstName = employee.FirstName,
        LastName = employee.LastName,
        Email = employee.Email,
        PhoneNumber = employee.PhoneNumber,
        DepartmentId = employee.DepartmentId,
        Designation = employee.Designation,
        JoiningDate = employee.JoiningDate,
        ManagerId = employee.ManagerId,
        Status = employee.Status
    };
}
public async Task<bool> DeleteAsync(string id)
{
    return await _employeeRepository.DeleteAsync(id);
}

public async Task<List<EmployeeResponse>> GetAllAsync()
{
    var employees = await _employeeRepository.GetAllAsync();

    return employees.Select(employee => new EmployeeResponse
    {
        Id = employee.Id!,
        EmployeeCode = employee.EmployeeCode,
        FirstName = employee.FirstName,
        LastName = employee.LastName,
        Email = employee.Email,
        PhoneNumber = employee.PhoneNumber,
        DepartmentId = employee.DepartmentId,
        Designation = employee.Designation,
        JoiningDate = employee.JoiningDate,
        ManagerId = employee.ManagerId,
        Status = employee.Status
    }).ToList();
}

 public async Task<List<EmployeeResponse>> GetByDepartmentAsync(string departmentId)
{
    var employees = await _employeeRepository.GetByDepartmentAsync(departmentId);

    return employees.Select(employee => new EmployeeResponse
    {
        Id = employee.Id!,
        EmployeeCode = employee.EmployeeCode,
        FirstName = employee.FirstName,
        LastName = employee.LastName,
        Email = employee.Email,
        PhoneNumber = employee.PhoneNumber,
        DepartmentId = employee.DepartmentId,
        Designation = employee.Designation,
        JoiningDate = employee.JoiningDate,
        ManagerId = employee.ManagerId,
        Status = employee.Status
    }).ToList();
}
public async Task<EmployeeResponse?> GetByIdAsync(string id)
{
    var employee = await _employeeRepository.GetByIdAsync(id);

    if (employee == null)
        return null;

    return new EmployeeResponse
    {
        Id = employee.Id!,
        EmployeeCode = employee.EmployeeCode,
        FirstName = employee.FirstName,
        LastName = employee.LastName,
        Email = employee.Email,
        PhoneNumber = employee.PhoneNumber,
        DepartmentId = employee.DepartmentId,
        Designation = employee.Designation,
        JoiningDate = employee.JoiningDate,
        ManagerId = employee.ManagerId,
        Status = employee.Status
    };
}

    public async Task<EmployeeResponse> UpdateAsync(UpdateEmployeeRequest request)
{
    var employee = await _employeeRepository.GetByIdAsync(request.Id);

    if (employee == null)
        throw new Exception("Employee not found.");

    employee.EmployeeCode = request.EmployeeCode;
    employee.FirstName = request.FirstName;
    employee.LastName = request.LastName;
    employee.Email = request.Email;
    employee.PhoneNumber = request.PhoneNumber;
    employee.DepartmentId = request.DepartmentId;
    employee.Designation = request.Designation;
    employee.JoiningDate = request.JoiningDate;
    employee.ManagerId = request.ManagerId;
    employee.Status = request.Status;
    employee.UpdatedAt = DateTime.UtcNow;

    await _employeeRepository.UpdateAsync(employee);

    return new EmployeeResponse
    {
        Id = employee.Id!,
        EmployeeCode = employee.EmployeeCode,
        FirstName = employee.FirstName,
        LastName = employee.LastName,
        Email = employee.Email,
        PhoneNumber = employee.PhoneNumber,
        DepartmentId = employee.DepartmentId,
        Designation = employee.Designation,
        JoiningDate = employee.JoiningDate,
        ManagerId = employee.ManagerId,
        Status = employee.Status
    };
}
}