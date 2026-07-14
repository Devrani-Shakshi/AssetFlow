using AssetFlow.Domain.Entities;

namespace AssetFlow.Application.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);

    Task<User?> GetByIdAsync(string id);

    Task CreateAsync(User user);

    Task UpdateAsync(User user);
}