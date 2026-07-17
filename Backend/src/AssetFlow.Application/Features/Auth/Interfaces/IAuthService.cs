using AssetFlow.Application.Features.Auth.DTOs;

namespace AssetFlow.Application.Features.Auth.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);

    Task<AuthResponse> LoginAsync(LoginRequest request);

    Task<AuthResponse> ForgotPasswordAsync(ForgotPasswordRequest request);

    Task<AuthResponse> ResetPasswordAsync(ResetPasswordRequest request);
}