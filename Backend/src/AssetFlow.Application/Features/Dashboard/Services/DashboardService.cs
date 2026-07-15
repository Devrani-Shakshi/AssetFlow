using AssetFlow.Application.Features.Dashboard.DTOs;
using AssetFlow.Application.Features.Dashboard.Interfaces;
using AssetFlow.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AssetFlow.Application.Features.Dashboard.Services;

public class DashboardService : IDashboardService
{
    private readonly IAssetRepository _assetRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IDepartmentRepository _departmentRepository;
    private readonly IVendorRepository _vendorRepository;
    private readonly IAssetCategoryRepository _categoryRepository;
    private readonly ILocationRepository _locationRepository;
    private readonly IAllocationRepository _allocationRepository;

    public DashboardService(
        IAssetRepository assetRepository,
        IEmployeeRepository employeeRepository,
        IDepartmentRepository departmentRepository,
        IVendorRepository vendorRepository,
        IAssetCategoryRepository categoryRepository,
        ILocationRepository locationRepository,
        IAllocationRepository allocationRepository)
    {
        _assetRepository = assetRepository;
        _employeeRepository = employeeRepository;
        _departmentRepository = departmentRepository;
        _vendorRepository = vendorRepository;
        _categoryRepository = categoryRepository;
        _locationRepository = locationRepository;
        _allocationRepository = allocationRepository;
    }

    public async Task<DashboardSummaryResponse> GetSummaryAsync()
    {
        var assets = await _assetRepository.GetAllAsync();
        var employees = await _employeeRepository.GetAllAsync();
        var departments = await _departmentRepository.GetAllAsync();
        var vendors = await _vendorRepository.GetAllAsync();
        var categories = await _categoryRepository.GetAllAsync();
        var locations = await _locationRepository.GetAllAsync();

        return new DashboardSummaryResponse
        {
            TotalAssets = assets.Count,
            AssignedAssets = assets.Count(x => x.Status.Equals("Allocated", StringComparison.OrdinalIgnoreCase)),
            AvailableAssets = assets.Count(x => x.Status.Equals("Available", StringComparison.OrdinalIgnoreCase)),
            MaintenanceAssets = assets.Count(x => x.Status.Equals("Under Maintenance", StringComparison.OrdinalIgnoreCase)),
            DisposedAssets = assets.Count(x => x.Status.Equals("Disposed", StringComparison.OrdinalIgnoreCase)),
            TotalEmployees = employees.Count,
            TotalDepartments = departments.Count,
            TotalVendors = vendors.Count,
            TotalCategories = categories.Count,
            TotalLocations = locations.Count
        };
    }

    public async Task<List<CategorySummaryResponse>> GetCategorySummaryAsync()
    {
        var assets = await _assetRepository.GetAllAsync();
        var categories = await _categoryRepository.GetAllAsync();

        var summary = assets
            .GroupBy(x => x.CategoryId)
            .Select(g =>
            {
                var categoryName = categories.FirstOrDefault(c => c.Id == g.Key)?.CategoryName ?? "Unknown";
                return new CategorySummaryResponse
                {
                    CategoryName = categoryName,
                    AssetCount = g.Count()
                };
            })
            .ToList();

        return summary;
    }

    public async Task<List<DepartmentSummaryResponse>> GetDepartmentSummaryAsync()
    {
        var assets = await _assetRepository.GetAllAsync();
        var departments = await _departmentRepository.GetAllAsync();

        var summary = assets
            .GroupBy(x => x.DepartmentId)
            .Select(g =>
            {
                var deptName = departments.FirstOrDefault(d => d.Id == g.Key)?.Name ?? "Unknown";
                return new DepartmentSummaryResponse
                {
                    DepartmentName = deptName,
                    AssetCount = g.Count()
                };
            })
            .ToList();

        return summary;
    }

    public async Task<List<MonthlyPurchaseResponse>> GetMonthlyPurchasesAsync()
    {
        var assets = await _assetRepository.GetAllAsync();

        var summary = assets
            .GroupBy(x => x.PurchaseDate.ToString("yyyy-MM"))
            .OrderBy(g => g.Key)
            .Select(g => new MonthlyPurchaseResponse
            {
                Month = g.Key,
                TotalCost = g.Sum(x => x.PurchaseCost),
                Count = g.Count()
            })
            .ToList();

        return summary;
    }

    public async Task<List<MonthlyAllocationResponse>> GetMonthlyAllocationsAsync()
    {
        var allocations = await _allocationRepository.GetAllAsync();

        var summary = allocations
            .GroupBy(x => x.AllocatedDate.ToString("yyyy-MM"))
            .OrderBy(g => g.Key)
            .Select(g => new MonthlyAllocationResponse
            {
                Month = g.Key,
                Count = g.Count()
            })
            .ToList();

        return summary;
    }
}
