namespace MiniStore.Core.DTOs.Auth
{
    public class AuthResponseDto
    {
        public string Token { get; set; } = null!;
        public DateTime ExpiresAt { get; set; }
        public Guid UserId { get; set; }
        public string UserName { get; set; } = null!;
        public string Role { get; set; } = null!;
    }
}
