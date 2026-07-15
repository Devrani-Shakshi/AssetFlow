using System;

namespace AssetFlow.Domain.Entities;

public class AssetDisposal : BaseEntity
{
    public string AssetId { get; set; } = string.Empty;

    public DateTime DisposalDate { get; set; }

    public string Reason { get; set; } = string.Empty;

    public string DisposalMethod { get; set; } = string.Empty; // e.g., Sold, Scrapped, Donated

    public decimal AmountRecovered { get; set; }

    public string ApprovedBy { get; set; } = string.Empty;

    public string? Remarks { get; set; }
}
