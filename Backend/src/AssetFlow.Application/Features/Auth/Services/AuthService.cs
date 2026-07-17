using AssetFlow.Application.Features.Auth.DTOs;
using AssetFlow.Application.Features.Auth.Interfaces;
using AssetFlow.Application.Interfaces;
using AssetFlow.Domain.Entities;
using AssetFlow.Domain.Enums;

namespace AssetFlow.Application.Features.Auth.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IPasswordResetTokenRepository _tokenRepository;
    private readonly IEmailService _emailService;

    public AuthService(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IJwtTokenService jwtTokenService,
        IPasswordResetTokenRepository tokenRepository,
        IEmailService emailService)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtTokenService = jwtTokenService;
        _tokenRepository = tokenRepository;
        _emailService = emailService;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var existingUser = await _userRepository.GetByEmailAsync(request.Email);

        if (existingUser != null)
        {
            return new AuthResponse
            {
                Success = false,
                Message = "Email already exists."
            };
        }

        var user = new User
        {
            EmployeeCode = request.EmployeeCode,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            PasswordHash = _passwordHasher.HashPassword(request.Password),
            Role = UserRole.Employee,
            Status = UserStatus.Active
        };

        await _userRepository.CreateAsync(user);

        var token = _jwtTokenService.GenerateToken(user);

        return new AuthResponse
        {
            Success = true,
            Message = "Registration successful.",
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddMinutes(60)
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);

        if (user == null || !_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            return new AuthResponse
            {
                Success = false,
                Message = "Invalid email or password."
            };
        }

        var token = _jwtTokenService.GenerateToken(user);

        return new AuthResponse
        {
            Success = true,
            Message = "Login successful.",
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddMinutes(60)
        };
    }

    public async Task<AuthResponse> ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);
        if (user == null)
        {
            return new AuthResponse
            {
                Success = false,
                Message = "Email address not registered."
            };
        }

        var resetToken = new PasswordResetToken
        {
            Email = request.Email,
            Token = Guid.NewGuid().ToString(),
            ExpiryDate = DateTime.UtcNow.AddHours(2),
            IsUsed = false
        };

        await _tokenRepository.CreateAsync(resetToken);

        var resetLink = $"http://localhost:4200/reset-password?token={resetToken.Token}";
        var emailBody = $@"
            <h2>Reset Your Password</h2>
            <p>You requested a password reset for your AssetFlow account.</p>
            <p>Click the link below to set a new password. This link is valid for 2 hours:</p>
            <p><a href='{resetLink}' style='padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px; display: inline-block;'>Reset Password</a></p>
            <p>If you did not request this, you can safely ignore this email.</p>";

        try
        {
            await _emailService.SendEmailAsync(request.Email, "Reset Your Password - AssetFlow", emailBody);
        }
        catch (Exception ex)
        {
            return new AuthResponse
            {
                Success = false,
                Message = $"Failed to send email: {ex.Message}"
            };
        }

        return new AuthResponse
        {
            Success = true,
            Message = "Password reset link has been sent to your email."
        };
    }

    public async Task<AuthResponse> ResetPasswordAsync(ResetPasswordRequest request)
    {
        var resetToken = await _tokenRepository.GetByTokenAsync(request.Token);
        if (resetToken == null || resetToken.ExpiryDate < DateTime.UtcNow)
        {
            return new AuthResponse
            {
                Success = false,
                Message = "Invalid or expired reset token."
            };
        }

        var user = await _userRepository.GetByEmailAsync(resetToken.Email);
        if (user == null)
        {
            return new AuthResponse
            {
                Success = false,
                Message = "User associated with this token not found."
            };
        }

        user.PasswordHash = _passwordHasher.HashPassword(request.Password);
        await _userRepository.UpdateAsync(user);

        resetToken.IsUsed = true;
        await _tokenRepository.UpdateAsync(resetToken);

        return new AuthResponse
        {
            Success = true,
            Message = "Password has been reset successfully."
        };
    }
}