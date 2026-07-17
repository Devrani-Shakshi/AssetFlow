namespace AssetFlow.Domain.Entities;

public class PasswordResetToken : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiryDate { get; set; }
    public bool IsUsed { get; set; } = false;
}
