using System.Collections.Generic;

namespace AssetFlow.Application.Features.Assets.DTOs;

public class PagedResponse<T>
{
    public List<T> Items { get; set; } = new List<T>();

    public int PageNumber { get; set; }

    public int PageSize { get; set; }

    public int TotalPages { get; set; }

    public long TotalCount { get; set; }
}
