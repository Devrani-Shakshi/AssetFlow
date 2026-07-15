namespace AssetFlow.Application.Interfaces;

public interface ICurrentUserContext
{
    string UserId { get; }

    string? IPAddress { get; }

    string? UserAgent { get; }
}
