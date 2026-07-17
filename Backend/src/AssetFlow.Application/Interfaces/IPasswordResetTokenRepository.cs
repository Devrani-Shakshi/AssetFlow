using AssetFlow.Domain.Entities;

namespace AssetFlow.Application.Interfaces;

public interface IPasswordResetTokenRepository
{
    Task<PasswordResetToken?> GetByTokenAsync(string token);
    Task CreateAsync(PasswordResetToken token);
    Task UpdateAsync(PasswordResetToken token);
}
