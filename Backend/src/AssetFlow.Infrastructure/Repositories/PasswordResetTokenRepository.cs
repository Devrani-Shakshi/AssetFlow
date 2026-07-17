using AssetFlow.Application.Interfaces;
using AssetFlow.Domain.Entities;
using AssetFlow.Infrastructure.Mongo;
using MongoDB.Driver;

namespace AssetFlow.Infrastructure.Repositories;

public class PasswordResetTokenRepository : IPasswordResetTokenRepository
{
    private readonly IMongoCollection<PasswordResetToken> _tokens;

    public PasswordResetTokenRepository(MongoDbContext context)
    {
        _tokens = context.PasswordResetTokens;
    }

    public async Task CreateAsync(PasswordResetToken token)
    {
        await _tokens.InsertOneAsync(token);
    }

    public async Task<PasswordResetToken?> GetByTokenAsync(string token)
    {
        return await _tokens.Find(x => x.Token == token && !x.IsUsed).FirstOrDefaultAsync();
    }

    public async Task UpdateAsync(PasswordResetToken token)
    {
        await _tokens.ReplaceOneAsync(x => x.Id == token.Id, token);
    }
}
