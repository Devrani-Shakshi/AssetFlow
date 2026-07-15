using System;

namespace AssetFlow.Application.Features.Audit.DTOs;

public class AuditLogResponse
{
    public string Id { get; set; } = string.Empty;

    public string UserId { get; set; } = string.Empty;

    public string Action { get; set; } = string.Empty;

    public string EntityName { get; set; } = string.Empty;

    public string EntityId { get; set; } = string.Empty;

    public string? OldValue { get; set; }

    public string? NewValue { get; set; }

    public DateTime Timestamp { get; set; }

    public string? IPAddress { get; set; }

    public string? UserAgent { get; set; }
}
