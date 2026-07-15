using AssetFlow.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AssetFlow.Application.Interfaces;

public interface INotificationRepository
{
    Task CreateAsync(Notification notification);

    Task UpdateAsync(Notification notification);

    Task<bool> DeleteAsync(string id);

    Task<Notification?> GetByIdAsync(string id);

    Task<List<Notification>> GetAllAsync();

    Task<List<Notification>> GetByUserIdAsync(string userId);

    Task<List<Notification>> GetUnreadByUserIdAsync(string userId);
}
