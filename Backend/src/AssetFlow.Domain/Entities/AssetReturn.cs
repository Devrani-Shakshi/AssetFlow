using System;

namespace AssetFlow.Domain.Entities;

public class AssetReturn : BaseEntity
{
    public string AssetId { get; set; } = string.Empty;

    public string EmployeeId { get; set; } = string.Empty;

    public DateTime ReturnDate { get; set; } = DateTime.UtcNow;

    public string Condition { get; set; } = "Good";

    public string? Remarks { get; set; }

    public string ReceivedBy { get; set; } = string.Empty;
}
