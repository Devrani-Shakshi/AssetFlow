namespace AssetFlow.Application.Features.Dashboard.DTOs;

public class MonthlyPurchaseResponse
{
    public string Month { get; set; } = string.Empty; // e.g. "2026-07"

    public decimal TotalCost { get; set; }

    public int Count { get; set; }
}
