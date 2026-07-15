using AssetFlow.Application.Features.AssetDisposal.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AssetFlow.Application.Features.AssetDisposal.Interfaces;

public interface IAssetDisposalService
{
    Task<DisposalResponse> CreateAsync(CreateDisposalRequest request);

    Task<List<DisposalResponse>> GetAllAsync();

    Task<DisposalResponse?> GetByIdAsync(string id);

    Task<DisposalResponse> UpdateAsync(UpdateDisposalRequest request);

    Task<bool> DeleteAsync(string id);
}
