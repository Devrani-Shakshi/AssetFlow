using AssetFlow.Application.Features.Assets.DTOs;
using FluentValidation;

namespace AssetFlow.Application.Features.Assets.Validators;

public class CreateAssetRequestValidator : AbstractValidator<CreateAssetRequest>
{
    public CreateAssetRequestValidator()
    {
        RuleFor(x => x.AssetCode).NotEmpty().WithMessage("Asset Code is required.");
        RuleFor(x => x.AssetName).NotEmpty().WithMessage("Asset Name is required.");
        RuleFor(x => x.CategoryId).NotEmpty().WithMessage("Category ID is required.");
        RuleFor(x => x.PurchaseCost).GreaterThan(0).WithMessage("Purchase Cost must be greater than zero.");
    }
}
