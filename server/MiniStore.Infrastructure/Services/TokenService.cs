using MiniStore.Core.Entities;
using MiniStore.Core.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MiniStore.Infrastructure.Services
{
    public class TokenService : ITokenService
    {
        private readonly string _key;
        private readonly string _issuer;
        private readonly string _audience;

        public TokenService()
        {
            _key = Environment.GetEnvironmentVariable("JWT_KEY")
                   ?? throw new Exception("JWT_KEY is missing");

            _issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "MiniStoreAPI";
            _audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "MiniStoreUsers";
        }

        public string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim("fullname", user.FullName),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _issuer,
                audience: _audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(20),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
