using AssetFlow.Domain.Entities;

namespace AssetFlow.Application.Features.Auth.Interfaces;

public interface IJwtTokenService
{
    string GenerateToken(User user);
}