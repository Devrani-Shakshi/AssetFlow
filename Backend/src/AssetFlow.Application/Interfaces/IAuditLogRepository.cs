using AssetFlow.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AssetFlow.Application.Interfaces;

public interface IAuditLogRepository
{
    Task CreateAsync(AuditLog log);

    Task<List<AuditLog>> GetAllAsync();

    Task<AuditLog?> GetByIdAsync(string id);

    Task<List<AuditLog>> GetByEntityAsync(string entityName, string entityId);

    Task<List<AuditLog>> GetByUserIdAsync(string userId);
}
