using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MiniStore.Core.DTOs.Auth;
using MiniStore.Core.Entities;
using MiniStore.Core.Enums;
using MiniStore.Core.Interfaces;

namespace MiniStore.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _users;
        private readonly ITokenService _tokens;

        public AuthController(IUserService users, ITokenService tokens)
        {
            _users = users;
            _tokens = tokens;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            if (await _users.GetByUsernameAsync(dto.UserName) != null)
                return BadRequest("Username already exists");

            // Initialize required members to avoid CS9035
            var user = new User
            {
                UserName = dto.UserName,
                FullName = dto.FullName,
                PasswordHash = Array.Empty<byte>(),
                PasswordSalt = Array.Empty<byte>(),
                Role = UserRole.Customer
            };

            await _users.CreateUserAsync(user, dto.Password);

            return Ok("User registered");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _users.GetByUsernameAsync(dto.UserName);
            if (user == null) return Unauthorized("Invalid credentials");

            if (!_users.VerifyPassword(dto.Password, user.PasswordHash, user.PasswordSalt))
                return Unauthorized("Invalid credentials");

            var accessToken = _tokens.CreateToken(user);
            var refreshToken = _users.CreateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);

            return Ok(new AuthResponseDto
            {
                Token = accessToken,
                ExpiresAt = DateTime.UtcNow.AddMinutes(60),
                UserId = user.Id,
                UserName = user.UserName!,
                Role = user.Role.ToString()
            });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenDto dto)
        {
            var user = await _users.GetByRefreshTokenAsync(dto.RefreshToken);

            if (user == null || user.RefreshTokenExpiry < DateTime.UtcNow)
                return Unauthorized("Invalid refresh token");

            var newAccessToken = _tokens.CreateToken(user);

            user.RefreshToken = _users.CreateRefreshToken();
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);

            await _users.SaveChangesAsync();

            return Ok(new
            {
                token = newAccessToken,
                refreshToken = user.RefreshToken
            });
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult Me()
        {
            return Ok(new
            {
                userId = User.FindFirst("nameid")?.Value,
                username = User.Identity?.Name,
                fullName = User.FindFirst("fullname")?.Value
            });
        }
    }
}
