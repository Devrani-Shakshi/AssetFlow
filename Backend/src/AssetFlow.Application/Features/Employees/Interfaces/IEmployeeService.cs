using AssetFlow.Application.Features.Employees.DTOs;

namespace AssetFlow.Application.Features.Employees.Interfaces;

public interface IEmployeeService
{
    Task<EmployeeResponse> CreateAsync(CreateEmployeeRequest request);

    Task<EmployeeResponse?> GetByIdAsync(string id);

    Task<List<EmployeeResponse>> GetAllAsync();

    Task<List<EmployeeResponse>> GetByDepartmentAsync(string departmentId);

    Task<EmployeeResponse> UpdateAsync(UpdateEmployeeRequest request);

    Task<bool> DeleteAsync(string id);
}