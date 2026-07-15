namespace AssetFlow.Application.Features.Assets.DTOs;

public class TransferAssetRequest
{
    public string AssetId { get; set; } = string.Empty;

    public string ToEmployeeId { get; set; } = string.Empty;
}
