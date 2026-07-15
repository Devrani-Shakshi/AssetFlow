namespace AssetFlow.Application.Features.Notifications.DTOs;

public class CreateNotificationRequest
{
    public string Title { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

    public string Type { get; set; } = "Info";

    public string UserId { get; set; } = string.Empty;
}
