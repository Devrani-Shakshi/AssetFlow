using AssetFlow.Application.Features.Notifications.DTOs;
using AssetFlow.Application.Features.Notifications.Interfaces;
using AssetFlow.Application.Interfaces;
using AssetFlow.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AssetFlow.Application.Features.Notifications.Services;

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _notificationRepository;

    public NotificationService(INotificationRepository notificationRepository)
    {
        _notificationRepository = notificationRepository;
    }

    public async Task<NotificationResponse> CreateAsync(CreateNotificationRequest request)
    {
        var notification = new Notification
        {
            Title = request.Title,
            Message = request.Message,
            Type = request.Type,
            UserId = request.UserId,
            IsRead = false
        };

        await _notificationRepository.CreateAsync(notification);

        return MapToResponse(notification);
    }

    public async Task<List<NotificationResponse>> GetAllAsync()
    {
        var list = await _notificationRepository.GetAllAsync();
        return list.Select(MapToResponse).ToList();
    }

    public async Task<NotificationResponse?> GetByIdAsync(string id)
    {
        var n = await _notificationRepository.GetByIdAsync(id);
        if (n == null)
            return null;

        return MapToResponse(n);
    }

    public async Task<NotificationResponse> UpdateAsync(UpdateNotificationRequest request)
    {
        var n = await _notificationRepository.GetByIdAsync(request.Id);
        if (n == null)
            throw new Exception("Notification not found.");

        n.Title = request.Title;
        n.Message = request.Message;
        n.Type = request.Type;
        n.UserId = request.UserId;
        n.IsRead = request.IsRead;
        n.UpdatedAt = DateTime.UtcNow;

        await _notificationRepository.UpdateAsync(n);

        return MapToResponse(n);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        return await _notificationRepository.DeleteAsync(id);
    }

    public async Task<List<NotificationResponse>> GetByUserIdAsync(string userId)
    {
        var list = await _notificationRepository.GetByUserIdAsync(userId);
        return list.Select(MapToResponse).ToList();
    }

    public async Task<List<NotificationResponse>> GetUnreadByUserIdAsync(string userId)
    {
        var list = await _notificationRepository.GetUnreadByUserIdAsync(userId);
        return list.Select(MapToResponse).ToList();
    }

    public async Task<bool> MarkAsReadAsync(string id)
    {
        var n = await _notificationRepository.GetByIdAsync(id);
        if (n == null)
            return false;

        n.IsRead = true;
        n.UpdatedAt = DateTime.UtcNow;

        await _notificationRepository.UpdateAsync(n);

        return true;
    }

    private static NotificationResponse MapToResponse(Notification n)
    {
        return new NotificationResponse
        {
            Id = n.Id!,
            Title = n.Title,
            Message = n.Message,
            Type = n.Type,
            UserId = n.UserId,
            IsRead = n.IsRead,
            CreatedAt = n.CreatedAt
        };
    }
}
