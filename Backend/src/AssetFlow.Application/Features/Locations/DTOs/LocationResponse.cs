namespace AssetFlow.Application.Features.Locations.DTOs;

public class LocationResponse
{
    public string Id { get; set; } = string.Empty;

    public string LocationCode { get; set; } = string.Empty;

    public string LocationName { get; set; } = string.Empty;

    public string? Building { get; set; }

    public string? Floor { get; set; }

    public string? Room { get; set; }

    public string? Description { get; set; }

    public bool IsActive { get; set; }
}
