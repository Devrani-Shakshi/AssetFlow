using AutoMapper;
using AssetFlow.Domain.Entities;
using AssetFlow.Application.Features.Assets.DTOs;
using AssetFlow.Application.Features.Departments.DTOs;
using AssetFlow.Application.Features.Employees.DTOs;
using AssetFlow.Application.Features.Vendors.DTOs;
using AssetFlow.Application.Features.AssetCategories.DTOs;
using AssetFlow.Application.Features.Locations.DTOs;
using AssetFlow.Application.Features.AssetAllocation.DTOs;
using AssetFlow.Application.Features.AssetReturn.DTOs;
using AssetFlow.Application.Features.Maintenance.DTOs;
using AssetFlow.Application.Features.AssetDisposal.DTOs;
using AssetFlow.Application.Features.Notifications.DTOs;
using AssetFlow.Application.Features.Audit.DTOs;

namespace AssetFlow.Application.Common;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Asset, AssetResponse>();
        CreateMap<Department, DepartmentResponse>();
        CreateMap<Employee, EmployeeResponse>();
        CreateMap<Domain.Entities.Vendor, VendorResponse>();
        CreateMap<AssetCategory, AssetCategoryResponse>();
        CreateMap<Location, LocationResponse>();
        CreateMap<Allocation, AllocationResponse>();
        CreateMap<AssetReturn, AssetReturnResponse>();
        CreateMap<AssetMaintenance, MaintenanceResponse>();
        CreateMap<AssetFlow.Domain.Entities.AssetDisposal, DisposalResponse>();
        CreateMap<Notification, NotificationResponse>();
        CreateMap<AuditLog, AuditLogResponse>();
    }
}
