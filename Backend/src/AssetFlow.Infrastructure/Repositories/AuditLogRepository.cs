using AssetFlow.Application.Interfaces;
using AssetFlow.Domain.Entities;
using AssetFlow.Infrastructure.Mongo;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AssetFlow.Infrastructure.Repositories;

public class AuditLogRepository : IAuditLogRepository
{
    private readonly IMongoCollection<AuditLog> _logs;

    public AuditLogRepository(MongoDbContext context)
    {
        _logs = context.AuditLogs;
    }

    public async Task CreateAsync(AuditLog log)
    {
        await _logs.InsertOneAsync(log);
    }

    public async Task<List<AuditLog>> GetAllAsync()
    {
        return await _logs
            .Find(x => !x.IsDeleted)
            .SortByDescending(x => x.Timestamp)
            .ToListAsync();
    }

    public async Task<AuditLog?> GetByIdAsync(string id)
    {
        return await _logs
            .Find(x => x.Id == id && !x.IsDeleted)
            .FirstOrDefaultAsync();
    }

    public async Task<List<AuditLog>> GetByEntityAsync(string entityName, string entityId)
    {
        return await _logs
            .Find(x => x.EntityName == entityName && x.EntityId == entityId && !x.IsDeleted)
            .SortByDescending(x => x.Timestamp)
            .ToListAsync();
    }

    public async Task<List<AuditLog>> GetByUserIdAsync(string userId)
    {
        return await _logs
            .Find(x => x.UserId == userId && !x.IsDeleted)
            .SortByDescending(x => x.Timestamp)
            .ToListAsync();
    }
}
