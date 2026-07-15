using AssetFlow.Infrastructure.Mongo;
using AssetFlow.Infrastructure.Mongo.Configuration;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
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
namespace AssetFlow.Infrastructure.DependencyInjection;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.Configure<MongoDbSettings>(
            configuration.GetSection("MongoDbSettings"));

        services.AddSingleton<MongoDbContext>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<IDepartmentRepository, DepartmentRepository>();
        services.AddScoped<IDepartmentService, DepartmentService>();
        services.AddScoped<IEmployeeRepository, EmployeeRepository>();
        services.AddScoped<IEmployeeService, EmployeeService>();
        services.AddScoped<IVendorRepository, VendorRepository>();
        services.AddScoped<IVendorService, VendorService>();
        services.AddScoped<IAssetCategoryRepository, AssetCategoryRepository>();
        services.AddScoped<IAssetCategoryService, AssetCategoryService>();
        return services;
    }
}