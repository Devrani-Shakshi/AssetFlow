using AssetFlow.Domain.Entities;

namespace AssetFlow.Application.Interfaces;

public interface IEmployeeRepository
{
    Task CreateAsync(Employee employee);

    Task UpdateAsync(Employee employee);

    Task<bool> DeleteAsync(string id);

    Task<Employee?> GetByIdAsync(string id);

    Task<List<Employee>> GetAllAsync();

    Task<Employee?> GetByEmailAsync(string email);

    Task<Employee?> GetByEmployeeCodeAsync(string employeeCode);

    Task<List<Employee>> GetByDepartmentAsync(string departmentId);
}