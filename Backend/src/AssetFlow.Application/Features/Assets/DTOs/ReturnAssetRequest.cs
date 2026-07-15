namespace AssetFlow.Application.Features.Assets.DTOs;

public class ReturnAssetRequest
{
    public string AssetId { get; set; } = string.Empty;

    public string Condition { get; set; } = "Good";
}
