namespace AssetFlow.Application.Features.AssetReturn.DTOs;

public class ProcessReturnRequest
{
    public string AssetId { get; set; } = string.Empty;

    public string EmployeeId { get; set; } = string.Empty;

    public string Condition { get; set; } = "Good";

    public string? Remarks { get; set; }

    public string ReceivedBy { get; set; } = string.Empty;
}
