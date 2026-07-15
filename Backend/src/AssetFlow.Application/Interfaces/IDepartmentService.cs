using AssetFlow.Application.Features.Departments.DTOs;

namespace AssetFlow.Application.Features.Departments.Interfaces;

public interface IDepartmentService
{
    Task<DepartmentResponse> CreateAsync(CreateDepartmentRequest request);

    Task<List<DepartmentResponse>> GetAllAsync();

    Task<DepartmentResponse?> GetByIdAsync(string id);

    Task<DepartmentResponse> UpdateAsync(UpdateDepartmentRequest request);

    Task<bool> DeleteAsync(string id);
}