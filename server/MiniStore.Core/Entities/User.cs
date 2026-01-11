using MiniStore.Core.Enums;

namespace MiniStore.Core.Entities
{
    public class User
    {
        public Guid Id { get; set; }

        public string UserName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;

        public required byte[] PasswordHash { get; set; }
        public required byte[] PasswordSalt { get; set; }

        public UserRole Role { get; set; } = UserRole.Customer;
        public UserStatus Status { get; set; } = UserStatus.Active;

        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiry { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? DeletedAt { get; set; }
    }
}
