using AssetFlow.Application.Interfaces;
using AssetFlow.Domain.Entities;
using AssetFlow.Infrastructure.Mongo;
using MongoDB.Driver;

namespace AssetFlow.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly IMongoCollection<User> _users;

    public UserRepository(MongoDbContext context)
    {
        _users = context.Database.GetCollection<User>("Users");
    }

    public async Task CreateAsync(User user)
    {
        await _users.InsertOneAsync(user);
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _users.Find(x => x.Email == email).FirstOrDefaultAsync();
    }

    public async Task<User?> GetByIdAsync(string id)
    {
        return await _users.Find(x => x.Id == id).FirstOrDefaultAsync();
    }

    public async Task UpdateAsync(User user)
    {
        await _users.ReplaceOneAsync(x => x.Id == user.Id, user);
    }
}