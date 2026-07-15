using System;

namespace AssetFlow.Application.Features.AssetReturn.DTOs;

public class AssetReturnResponse
{
    public string Id { get; set; } = string.Empty;

    public string AssetId { get; set; } = string.Empty;

    public string EmployeeId { get; set; } = string.Empty;

    public DateTime ReturnDate { get; set; }

    public string Condition { get; set; } = string.Empty;

    public string? Remarks { get; set; }

    public string ReceivedBy { get; set; } = string.Empty;
}
