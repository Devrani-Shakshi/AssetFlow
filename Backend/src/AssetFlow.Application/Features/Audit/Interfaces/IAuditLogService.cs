using AssetFlow.Application.Features.Audit.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AssetFlow.Application.Features.Audit.Interfaces;

public interface IAuditLogService
{
    Task LogActionAsync(string action, string entityName, string entityId, object? oldValue, object? newValue);

    Task<List<AuditLogResponse>> GetAllAsync();

    Task<AuditLogResponse?> GetByIdAsync(string id);

    Task<List<AuditLogResponse>> GetByEntityAsync(string entityName, string entityId);

    Task<List<AuditLogResponse>> GetByUserIdAsync(string userId);
}
