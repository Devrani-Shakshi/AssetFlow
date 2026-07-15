using AssetFlow.Application.Features.Departments.DTOs;
using AssetFlow.Application.Features.Departments.Interfaces;
using AssetFlow.Application.Interfaces;
using AssetFlow.Domain.Entities;

namespace AssetFlow.Application.Features.Departments.Services;

public class DepartmentService : IDepartmentService
{
    private readonly IDepartmentRepository _departmentRepository;

    public DepartmentService(IDepartmentRepository departmentRepository)
    {
        _departmentRepository = departmentRepository;
    }

    public async Task<DepartmentResponse> CreateAsync(CreateDepartmentRequest request)
    {
        var existingDepartment = await _departmentRepository.GetByCodeAsync(request.Code);

        if (existingDepartment != null)
        {
            throw new Exception("Department code already exists.");
        }

        var department = new Department
        {
            Code = request.Code,
            Name = request.Name,
            Description = request.Description,
            ManagerId = request.ManagerId,
            IsActive = true
        };

        await _departmentRepository.CreateAsync(department);

        return new DepartmentResponse
        {
            Id = department.Id!,
            Code = department.Code,
            Name = department.Name,
            Description = department.Description,
            ManagerId = department.ManagerId,
            IsActive = department.IsActive,
            CreatedAt = department.CreatedAt
        };
    }

    public async Task<List<DepartmentResponse>> GetAllAsync()
    {
        var departments = await _departmentRepository.GetAllAsync();

        return departments.Select(d => new DepartmentResponse
        {
            Id = d.Id!,
            Code = d.Code,
            Name = d.Name,
            Description = d.Description,
            ManagerId = d.ManagerId,
            IsActive = d.IsActive,
            CreatedAt = d.CreatedAt
        }).ToList();
    }

    public async Task<DepartmentResponse?> GetByIdAsync(string id)
    {
        var department = await _departmentRepository.GetByIdAsync(id);

        if (department == null)
            return null;

        return new DepartmentResponse
        {
            Id = department.Id!,
            Code = department.Code,
            Name = department.Name,
            Description = department.Description,
            ManagerId = department.ManagerId,
            IsActive = department.IsActive,
            CreatedAt = department.CreatedAt
        };
    }

    public async Task<DepartmentResponse> UpdateAsync(UpdateDepartmentRequest request)
    {
        var department = await _departmentRepository.GetByIdAsync(request.Id);

        if (department == null)
            throw new Exception("Department not found.");

        department.Code = request.Code;
        department.Name = request.Name;
        department.Description = request.Description;
        department.ManagerId = request.ManagerId;
        department.IsActive = request.IsActive;
        department.UpdatedAt = DateTime.UtcNow;

        await _departmentRepository.UpdateAsync(department);

        return new DepartmentResponse
        {
            Id = department.Id!,
            Code = department.Code,
            Name = department.Name,
            Description = department.Description,
            ManagerId = department.ManagerId,
            IsActive = department.IsActive,
            CreatedAt = department.CreatedAt
        };
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var department = await _departmentRepository.GetByIdAsync(id);

        if (department == null)
            return false;

        await _departmentRepository.DeleteAsync(id);

        return true;
    }
}