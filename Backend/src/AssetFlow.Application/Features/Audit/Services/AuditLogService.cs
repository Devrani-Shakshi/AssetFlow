using AssetFlow.Application.Features.Audit.DTOs;
using AssetFlow.Application.Features.Audit.Interfaces;
using AssetFlow.Application.Interfaces;
using AssetFlow.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace AssetFlow.Application.Features.Audit.Services;

public class AuditLogService : IAuditLogService
{
    private readonly IAuditLogRepository _auditLogRepository;
    private readonly ICurrentUserContext _currentUserContext;

    public AuditLogService(IAuditLogRepository auditLogRepository, ICurrentUserContext currentUserContext)
    {
        _auditLogRepository = auditLogRepository;
        _currentUserContext = currentUserContext;
    }

    public async Task LogActionAsync(string action, string entityName, string entityId, object? oldValue, object? newValue)
    {
        var oldJson = oldValue != null ? JsonSerializer.Serialize(oldValue) : null;
        var newJson = newValue != null ? JsonSerializer.Serialize(newValue) : null;

        var log = new AuditLog
        {
            UserId = _currentUserContext.UserId,
            Action = action,
            EntityName = entityName,
            EntityId = entityId,
            OldValue = oldJson,
            NewValue = newJson,
            Timestamp = DateTime.UtcNow,
            IPAddress = _currentUserContext.IPAddress,
            UserAgent = _currentUserContext.UserAgent
        };

        await _auditLogRepository.CreateAsync(log);
    }

    public async Task<List<AuditLogResponse>> GetAllAsync()
    {
        var list = await _auditLogRepository.GetAllAsync();
        return list.Select(MapToResponse).ToList();
    }

    public async Task<AuditLogResponse?> GetByIdAsync(string id)
    {
        var log = await _auditLogRepository.GetByIdAsync(id);
        if (log == null)
            return null;

        return MapToResponse(log);
    }

    public async Task<List<AuditLogResponse>> GetByEntityAsync(string entityName, string entityId)
    {
        var list = await _auditLogRepository.GetByEntityAsync(entityName, entityId);
        return list.Select(MapToResponse).ToList();
    }

    public async Task<List<AuditLogResponse>> GetByUserIdAsync(string userId)
    {
        var list = await _auditLogRepository.GetByUserIdAsync(userId);
        return list.Select(MapToResponse).ToList();
    }

    private static AuditLogResponse MapToResponse(AuditLog log)
    {
        return new AuditLogResponse
        {
            Id = log.Id!,
            UserId = log.UserId,
            Action = log.Action,
            EntityName = log.EntityName,
            EntityId = log.EntityId,
            OldValue = log.OldValue,
            NewValue = log.NewValue,
            Timestamp = log.Timestamp,
            IPAddress = log.IPAddress,
            UserAgent = log.UserAgent
        };
    }
}
