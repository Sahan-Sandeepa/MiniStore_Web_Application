using System.ComponentModel.DataAnnotations;

namespace MiniStore.Core.DTOs.Auth
{
    public class RegisterDto
    {
        [Required, MinLength(3)]
        public string UserName { get; set; } = null!;

        [Required, MinLength(6)]
        public string Password { get; set; } = null!;

        [EmailAddress]
        public string? Email { get; set; }
    }
}
