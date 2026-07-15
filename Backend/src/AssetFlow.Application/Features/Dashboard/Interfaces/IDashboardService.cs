using AssetFlow.Application.Features.Dashboard.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AssetFlow.Application.Features.Dashboard.Interfaces;

public interface IDashboardService
{
    Task<DashboardSummaryResponse> GetSummaryAsync();

    Task<List<CategorySummaryResponse>> GetCategorySummaryAsync();

    Task<List<DepartmentSummaryResponse>> GetDepartmentSummaryAsync();

    Task<List<MonthlyPurchaseResponse>> GetMonthlyPurchasesAsync();

    Task<List<MonthlyAllocationResponse>> GetMonthlyAllocationsAsync();
}
