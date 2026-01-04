using System.ComponentModel.DataAnnotations;

namespace MiniStore.Core.DTOs.Auth
{
    public class RegisterDto
    {
        [Required, MinLength(3)]
        public string UserName { get; set; } = string.Empty;

        [Required, MinLength(6)]
        public string FullName { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;

    }
}
