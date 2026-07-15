using AssetFlow.Domain.Entities;

namespace AssetFlow.Application.Interfaces;

public interface IDepartmentRepository
{
    Task CreateAsync(Department department);

    Task<List<Department>> GetAllAsync();

    Task<Department?> GetByIdAsync(string id);

    Task<Department?> GetByCodeAsync(string code);

    Task UpdateAsync(Department department);

    Task DeleteAsync(string id);
}