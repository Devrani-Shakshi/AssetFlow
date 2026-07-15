using System;

namespace AssetFlow.Application.Features.AssetDisposal.DTOs;

public class DisposalResponse
{
    public string Id { get; set; } = string.Empty;

    public string AssetId { get; set; } = string.Empty;

    public DateTime DisposalDate { get; set; }

    public string Reason { get; set; } = string.Empty;

    public string DisposalMethod { get; set; } = string.Empty;

    public decimal AmountRecovered { get; set; }

    public string ApprovedBy { get; set; } = string.Empty;

    public string? Remarks { get; set; }
}
