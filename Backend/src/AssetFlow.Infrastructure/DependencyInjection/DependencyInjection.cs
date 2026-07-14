using AssetFlow.Infrastructure.Mongo;
using AssetFlow.Infrastructure.Mongo.Configuration;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using AssetFlow.Application.Interfaces;
using AssetFlow.Infrastructure.Repositories;
using AssetFlow.Application.Features.Auth.Interfaces;
using AssetFlow.Application.Features.Auth.Services;
using AssetFlow.Infrastructure.Authentication;
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

        return services;
    }
}