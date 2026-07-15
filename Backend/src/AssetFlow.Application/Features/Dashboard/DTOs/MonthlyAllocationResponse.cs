namespace AssetFlow.Application.Features.Dashboard.DTOs;

public class MonthlyAllocationResponse
{
    public string Month { get; set; } = string.Empty; // e.g. "2026-07"

    public int Count { get; set; }
}
