using System;

namespace AssetFlow.Domain.Entities;

public class AuditLog : BaseEntity
{
    public string UserId { get; set; } = string.Empty;

    public string Action { get; set; } = string.Empty; // Create, Update, Delete, Allocate, Return, Transfer

    public string EntityName { get; set; } = string.Empty;

    public string EntityId { get; set; } = string.Empty;

    public string? OldValue { get; set; } // JSON representation

    public string? NewValue { get; set; } // JSON representation

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    public string? IPAddress { get; set; }

    public string? UserAgent { get; set; }
}
