using MiniStore.Core.Entities;
using MiniStore.Core.Interfaces;
using MiniStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace MiniStore.Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _db;

        public UserService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await _db.Users.FirstOrDefaultAsync(x => x.UserName == username);
        }

        public async Task<User> CreateUserAsync(User user, string password)
        {
            using var hmac = new HMACSHA256();
            user.PasswordSalt = hmac.Key;
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));

            _db.Users.Add(user);
            await _db.SaveChangesAsync();
            return user;
        }

        public bool VerifyPassword(string password, byte[] hash, byte[] salt)
        {
            using var hmac = new HMACSHA256(salt);
            var computed = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            return computed.SequenceEqual(hash);
        }

        public string CreateRefreshToken()
        {
            return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _db.Users.ToListAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _db.SaveChangesAsync();
        }
    }
}
