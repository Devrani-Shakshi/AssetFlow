using AssetFlow.Application.Features.Notifications.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AssetFlow.Application.Features.Notifications.Interfaces;

public interface INotificationService
{
    Task<NotificationResponse> CreateAsync(CreateNotificationRequest request);

    Task<List<NotificationResponse>> GetAllAsync();

    Task<NotificationResponse?> GetByIdAsync(string id);

    Task<NotificationResponse> UpdateAsync(UpdateNotificationRequest request);

    Task<bool> DeleteAsync(string id);

    Task<List<NotificationResponse>> GetByUserIdAsync(string userId);

    Task<List<NotificationResponse>> GetUnreadByUserIdAsync(string userId);

    Task<bool> MarkAsReadAsync(string id);
}
