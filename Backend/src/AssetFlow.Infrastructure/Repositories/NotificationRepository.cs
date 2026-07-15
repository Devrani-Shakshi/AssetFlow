using AssetFlow.Application.Interfaces;
using AssetFlow.Domain.Entities;
using AssetFlow.Infrastructure.Mongo;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AssetFlow.Infrastructure.Repositories;

public class NotificationRepository : INotificationRepository
{
    private readonly IMongoCollection<Notification> _notifications;

    public NotificationRepository(MongoDbContext context)
    {
        _notifications = context.Notifications;
    }

    public async Task CreateAsync(Notification notification)
    {
        await _notifications.InsertOneAsync(notification);
    }

    public async Task UpdateAsync(Notification notification)
    {
        await _notifications.ReplaceOneAsync(x => x.Id == notification.Id, notification);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var n = await GetByIdAsync(id);

        if (n == null)
            return false;

        n.IsDeleted = true;
        n.UpdatedAt = DateTime.UtcNow;

        await UpdateAsync(n);

        return true;
    }

    public async Task<Notification?> GetByIdAsync(string id)
    {
        return await _notifications
            .Find(x => x.Id == id && !x.IsDeleted)
            .FirstOrDefaultAsync();
    }

    public async Task<List<Notification>> GetAllAsync()
    {
        return await _notifications
            .Find(x => !x.IsDeleted)
            .ToListAsync();
    }

    public async Task<List<Notification>> GetByUserIdAsync(string userId)
    {
        return await _notifications
            .Find(x => x.UserId == userId && !x.IsDeleted)
            .ToListAsync();
    }

    public async Task<List<Notification>> GetUnreadByUserIdAsync(string userId)
    {
        return await _notifications
            .Find(x => x.UserId == userId && !x.IsRead && !x.IsDeleted)
            .ToListAsync();
    }
}
