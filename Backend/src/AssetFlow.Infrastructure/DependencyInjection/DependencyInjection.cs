using AssetFlow.Infrastructure.Mongo;
using AssetFlow.Infrastructure.Mongo.Configuration;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using FluentValidation;
using AssetFlow.Application.Interfaces;
using AssetFlow.Infrastructure.Repositories;
using AssetFlow.Application.Features.Auth.Interfaces;
using AssetFlow.Application.Features.Auth.Services;
using AssetFlow.Infrastructure.Authentication;
using AssetFlow.Application.Features.Departments.Services;
using AssetFlow.Application.Features.Departments.Interfaces;
using AssetFlow.Application.Features.Employees.Services;
using AssetFlow.Application.Features.Employees.Interfaces;
using AssetFlow.Application.Features.Vendors.Services;
using AssetFlow.Application.Features.Vendors.Interfaces;
using AssetFlow.Application.Features.AssetCategories.Services;
using AssetFlow.Application.Features.AssetCategories.Interfaces;
using AssetFlow.Application.Features.Locations.Services;
using AssetFlow.Application.Features.Locations.Interfaces;
using AssetFlow.Application.Features.Assets.Services;
using AssetFlow.Application.Features.Assets.Interfaces;
using AssetFlow.Application.Features.AssetAllocation.Services;
using AssetFlow.Application.Features.AssetAllocation.Interfaces;
using AssetFlow.Application.Features.AssetReturn.Services;
using AssetFlow.Application.Features.AssetReturn.Interfaces;
using AssetFlow.Application.Features.Maintenance.Services;
using AssetFlow.Application.Features.Maintenance.Interfaces;
using AssetFlow.Application.Features.AssetDisposal.Services;
using AssetFlow.Application.Features.AssetDisposal.Interfaces;
using AssetFlow.Application.Features.Dashboard.Services;
using AssetFlow.Application.Features.Dashboard.Interfaces;
using AssetFlow.Application.Features.Reports.Services;
using AssetFlow.Application.Features.Reports.Interfaces;
using AssetFlow.Application.Features.Notifications.Services;
using AssetFlow.Application.Features.Notifications.Interfaces;
using AssetFlow.Application.Features.Audit.Services;
using AssetFlow.Application.Features.Audit.Interfaces;
using AssetFlow.Application.Features.Statistics.Services;
using AssetFlow.Application.Features.Statistics.Interfaces;
using AssetFlow.Infrastructure.Email;
namespace AssetFlow.Infrastructure.DependencyInjection;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.Configure<MongoDbSettings>(
            configuration.GetSection("MongoDbSettings"));

        services.Configure<EmailSettings>(
            configuration.GetSection("EmailSettings"));

        services.AddSingleton<MongoDbContext>();
        services.AddAutoMapper(typeof(AssetFlow.Application.Common.MappingProfile).Assembly);
        services.AddValidatorsFromAssembly(typeof(AssetFlow.Application.Features.Assets.Validators.CreateAssetRequestValidator).Assembly);
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IPasswordResetTokenRepository, PasswordResetTokenRepository>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<IDepartmentRepository, DepartmentRepository>();
        services.AddScoped<IDepartmentService, DepartmentService>();
        services.AddScoped<IEmployeeRepository, EmployeeRepository>();
        services.AddScoped<IEmployeeService, EmployeeService>();
        services.AddScoped<IVendorRepository, VendorRepository>();
        services.AddScoped<IVendorService, VendorService>();
        services.AddScoped<IAssetCategoryRepository, AssetCategoryRepository>();
        services.AddScoped<IAssetCategoryService, AssetCategoryService>();
        services.AddScoped<ILocationRepository, LocationRepository>();
        services.AddScoped<ILocationService, LocationService>();
        services.AddScoped<IAssetRepository, AssetRepository>();
        services.AddScoped<IAssetService, AssetService>();
        services.AddScoped<IAllocationRepository, AllocationRepository>();
        services.AddScoped<IAllocationService, AllocationService>();
        services.AddScoped<IAssetReturnRepository, AssetReturnRepository>();
        services.AddScoped<IAssetReturnService, AssetReturnService>();
        services.AddScoped<IAssetMaintenanceRepository, AssetMaintenanceRepository>();
        services.AddScoped<IAssetMaintenanceService, AssetMaintenanceService>();
        services.AddScoped<IAssetDisposalRepository, AssetDisposalRepository>();
        services.AddScoped<IAssetDisposalService, AssetDisposalService>();
        services.AddScoped<IDashboardService, DashboardService>();
        services.AddScoped<IReportService, ReportService>();
        services.AddScoped<INotificationRepository, NotificationRepository>();
        services.AddScoped<INotificationService, NotificationService>();
        services.AddScoped<IAuditLogRepository, AuditLogRepository>();
        services.AddScoped<IAuditLogService, AuditLogService>();
        services.AddScoped<ICurrentUserContext, CurrentUserContext>();
        services.AddScoped<IStatisticsService, StatisticsService>();
        return services;
    }
}