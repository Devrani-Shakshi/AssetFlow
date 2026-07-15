using AssetFlow.Application.Interfaces;
using AssetFlow.Domain.Entities;
using AssetFlow.Infrastructure.Mongo;
using MongoDB.Driver;

namespace AssetFlow.Infrastructure.Repositories;

public class EmployeeRepository : IEmployeeRepository
{
    private readonly IMongoCollection<Employee> _employees;

    public EmployeeRepository(MongoDbContext context)
    {
        _employees = context.Database.GetCollection<Employee>("Employees");
    }

    public async Task CreateAsync(Employee employee)
    {
        await _employees.InsertOneAsync(employee);
    }

    public async Task UpdateAsync(Employee employee)
    {
        await _employees.ReplaceOneAsync(x => x.Id == employee.Id, employee);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var employee = await GetByIdAsync(id);

        if (employee == null)
            return false;

        employee.IsDeleted = true;
        employee.UpdatedAt = DateTime.UtcNow;

        await UpdateAsync(employee);

        return true;
    }

    public async Task<Employee?> GetByIdAsync(string id)
    {
        return await _employees
            .Find(x => x.Id == id && !x.IsDeleted)
            .FirstOrDefaultAsync();
    }

    public async Task<List<Employee>> GetAllAsync()
    {
        return await _employees
            .Find(x => !x.IsDeleted)
            .ToListAsync();
    }

    public async Task<Employee?> GetByEmailAsync(string email)
    {
        return await _employees
            .Find(x => x.Email == email && !x.IsDeleted)
            .FirstOrDefaultAsync();
    }

    public async Task<Employee?> GetByEmployeeCodeAsync(string employeeCode)
    {
        return await _employees
            .Find(x => x.EmployeeCode == employeeCode && !x.IsDeleted)
            .FirstOrDefaultAsync();
    }

    public async Task<List<Employee>> GetByDepartmentAsync(string departmentId)
    {
        return await _employees
            .Find(x => x.DepartmentId == departmentId && !x.IsDeleted)
            .ToListAsync();
    }
}