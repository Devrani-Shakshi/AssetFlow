using System;

namespace AssetFlow.Domain.Entities;

public class Notification : BaseEntity
{
    public string Title { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

    public string Type { get; set; } = "Info"; // Info, Warning, Alert, Success

    public string UserId { get; set; } = string.Empty;

    public bool IsRead { get; set; } = false;
}
