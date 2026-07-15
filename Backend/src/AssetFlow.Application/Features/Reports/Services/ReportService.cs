using AssetFlow.Application.Features.Assets.DTOs;
using AssetFlow.Application.Features.Vendors.DTOs;
using AssetFlow.Application.Features.Employees.DTOs;
using AssetFlow.Application.Features.Departments.DTOs;
using AssetFlow.Application.Features.Maintenance.DTOs;
using AssetFlow.Application.Features.AssetDisposal.DTOs;
using AssetFlow.Application.Features.Reports.Interfaces;
using AssetFlow.Application.Interfaces;
using AssetFlow.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AssetFlow.Application.Features.Reports.Services;

public class ReportService : IReportService
{
    private readonly IAssetRepository _assetRepository;
    private readonly IVendorRepository _vendorRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IDepartmentRepository _departmentRepository;
    private readonly IAssetMaintenanceRepository _maintenanceRepository;
    private readonly IAssetDisposalRepository _disposalRepository;

    public ReportService(
        IAssetRepository assetRepository,
        IVendorRepository vendorRepository,
        IEmployeeRepository employeeRepository,
        IDepartmentRepository departmentRepository,
        IAssetMaintenanceRepository maintenanceRepository,
        IAssetDisposalRepository disposalRepository)
    {
        _assetRepository = assetRepository;
        _vendorRepository = vendorRepository;
        _employeeRepository = employeeRepository;
        _departmentRepository = departmentRepository;
        _maintenanceRepository = maintenanceRepository;
        _disposalRepository = disposalRepository;
    }

    public async Task<List<AssetResponse>> GetAssetsReportAsync()
    {
        var list = await _assetRepository.GetAllAsync();
        return list.Select(MapToAssetResponse).ToList();
    }

    public async Task<List<VendorResponse>> GetVendorsReportAsync()
    {
        var list = await _vendorRepository.GetAllAsync();
        return list.Select(MapToVendorResponse).ToList();
    }

    public async Task<List<EmployeeResponse>> GetEmployeesReportAsync()
    {
        var list = await _employeeRepository.GetAllAsync();
        return list.Select(MapToEmployeeResponse).ToList();
    }

    public async Task<List<DepartmentResponse>> GetDepartmentsReportAsync()
    {
        var list = await _departmentRepository.GetAllAsync();
        return list.Select(MapToDepartmentResponse).ToList();
    }

    public async Task<List<MaintenanceResponse>> GetMaintenanceReportAsync()
    {
        var list = await _maintenanceRepository.GetAllAsync();
        return list.Select(MapToMaintenanceResponse).ToList();
    }

    public async Task<List<DisposalResponse>> GetDisposalReportAsync()
    {
        var list = await _disposalRepository.GetAllAsync();
        return list.Select(MapToDisposalResponse).ToList();
    }

    public async Task<List<AssetResponse>> GetWarrantyExpiryReportAsync()
    {
        var list = await _assetRepository.GetAllAsync();
        // Warranty expiring soon or already expired:
        return list
            .Where(x => x.WarrantyEnd != null)
            .OrderBy(x => x.WarrantyEnd)
            .Select(MapToAssetResponse)
            .ToList();
    }

    private static AssetResponse MapToAssetResponse(Asset asset)
    {
        return new AssetResponse
        {
            Id = asset.Id!,
            AssetCode = asset.AssetCode,
            AssetName = asset.AssetName,
            Description = asset.Description,
            SerialNumber = asset.SerialNumber,
            Barcode = asset.Barcode,
            QRCode = asset.QRCode,
            CategoryId = asset.CategoryId,
            VendorId = asset.VendorId,
            DepartmentId = asset.DepartmentId,
            AssignedEmployeeId = asset.AssignedEmployeeId,
            LocationId = asset.LocationId,
            PurchaseDate = asset.PurchaseDate,
            PurchaseCost = asset.PurchaseCost,
            WarrantyStart = asset.WarrantyStart,
            WarrantyEnd = asset.WarrantyEnd,
            DepreciationRate = asset.DepreciationRate,
            CurrentValue = asset.CurrentValue,
            Condition = asset.Condition,
            Status = asset.Status,
            Notes = asset.Notes,
            ImageUrls = asset.ImageUrls,
            InvoiceDocument = asset.InvoiceDocument
        };
    }

    private static VendorResponse MapToVendorResponse(Vendor vendor)
    {
        return new VendorResponse
        {
            Id = vendor.Id!,
            VendorCode = vendor.VendorCode,
            VendorName = vendor.VendorName,
            ContactPerson = vendor.ContactPerson,
            Email = vendor.Email,
            PhoneNumber = vendor.PhoneNumber,
            GSTNumber = vendor.GSTNumber,
            Address = vendor.Address,
            City = vendor.City,
            State = vendor.State,
            Country = vendor.Country,
            PostalCode = vendor.PostalCode,
            Website = vendor.Website,
            IsActive = vendor.IsActive
        };
    }

    private static EmployeeResponse MapToEmployeeResponse(Employee e)
    {
        return new EmployeeResponse
        {
            Id = e.Id!,
            EmployeeCode = e.EmployeeCode,
            FirstName = e.FirstName,
            LastName = e.LastName,
            Email = e.Email,
            PhoneNumber = e.PhoneNumber,
            DepartmentId = e.DepartmentId,
            Designation = e.Designation,
            JoiningDate = e.JoiningDate,
            ManagerId = e.ManagerId,
            Status = e.Status
        };
    }

    private static DepartmentResponse MapToDepartmentResponse(Department d)
    {
        return new DepartmentResponse
        {
            Id = d.Id!,
            Code = d.Code,
            Name = d.Name,
            Description = d.Description,
            ManagerId = d.ManagerId,
            IsActive = d.IsActive
        };
    }

    private static MaintenanceResponse MapToMaintenanceResponse(AssetMaintenance m)
    {
        return new MaintenanceResponse
        {
            Id = m.Id!,
            AssetId = m.AssetId,
            VendorId = m.VendorId,
            MaintenanceDate = m.MaintenanceDate,
            MaintenanceType = m.MaintenanceType,
            Description = m.Description,
            Cost = m.Cost,
            Status = m.Status,
            ExpectedCompletionDate = m.ExpectedCompletionDate,
            CompletedDate = m.CompletedDate,
            Remarks = m.Remarks
        };
    }

    private static DisposalResponse MapToDisposalResponse(AssetFlow.Domain.Entities.AssetDisposal d)
    {
        return new DisposalResponse
        {
            Id = d.Id!,
            AssetId = d.AssetId,
            DisposalDate = d.DisposalDate,
            Reason = d.Reason,
            DisposalMethod = d.DisposalMethod,
            AmountRecovered = d.AmountRecovered,
            ApprovedBy = d.ApprovedBy,
            Remarks = d.Remarks
        };
    }
}
