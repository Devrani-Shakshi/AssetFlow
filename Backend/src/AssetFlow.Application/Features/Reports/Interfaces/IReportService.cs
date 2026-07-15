using AssetFlow.Application.Features.Assets.DTOs;
using AssetFlow.Application.Features.Vendors.DTOs;
using AssetFlow.Application.Features.Employees.DTOs;
using AssetFlow.Application.Features.Departments.DTOs;
using AssetFlow.Application.Features.Maintenance.DTOs;
using AssetFlow.Application.Features.AssetDisposal.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AssetFlow.Application.Features.Reports.Interfaces;

public interface IReportService
{
    Task<List<AssetResponse>> GetAssetsReportAsync();

    Task<List<VendorResponse>> GetVendorsReportAsync();

    Task<List<EmployeeResponse>> GetEmployeesReportAsync();

    Task<List<DepartmentResponse>> GetDepartmentsReportAsync();

    Task<List<MaintenanceResponse>> GetMaintenanceReportAsync();

    Task<List<DisposalResponse>> GetDisposalReportAsync();

    Task<List<AssetResponse>> GetWarrantyExpiryReportAsync();
}
