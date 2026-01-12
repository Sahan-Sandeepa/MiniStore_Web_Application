using MiniStore.Core.Entities;
using MiniStore.Core.Interfaces;
using MiniStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using MiniStore.Core.Enums;
using MiniStore.Core.DTOs;

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

        public async Task<List<AdminUserDto>> GetAllNonAdminUsersAsync()
        {
            return await _db.Users
                .IgnoreQueryFilters()
                .Where(u => u.Role != UserRole.Admin)
                .Select(u => new AdminUserDto
                {
                    Id = u.Id,
                    UserName = u.UserName,
                    FullName = u.FullName,
                    Role = u.Role.ToString(),
                    Status = u.Status.ToString(),
                    CreatedAt = u.CreatedAt,
                    DeletedAt = u.DeletedAt
                })
                .ToListAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _db.SaveChangesAsync();
        }

        public async Task<User?> GetByRefreshTokenAsync(string refreshToken)
        {
            return await _db.Users
                .FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);
        }

        public async Task<User?> GetByIdAsync(Guid id)
        {
            return await _db.Users.FindAsync(id);
        }

        public async Task DisableUserAsync(Guid userId)
        {
            var user = await _db.Users
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                throw new Exception("User not found");

            if (user.Status == UserStatus.Deleted)
                throw new Exception("Cannot disable a deleted user");

            user.Status = UserStatus.Disabled;
            user.DeletedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
        }

        public async Task EnableUserAsync(Guid userId)
        {
            var user = await _db.Users
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                throw new Exception("User not found");

            if (user.Status == UserStatus.Deleted)
                throw new Exception("Deleted users cannot be re-enabled");

            user.Status = UserStatus.Active;
            user.DeletedAt = null;

            await _db.SaveChangesAsync();
        }

        public async Task SoftDeleteUserAsync(Guid userId, Guid currentAdminId)
        {
            if (userId == currentAdminId)
                throw new Exception("Admin cannot delete themselves");

            var user = await _db.Users
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                throw new Exception("User not found");

            if (user.Role == UserRole.Admin)
                throw new Exception("Cannot delete admin");

            user.Status = UserStatus.Deleted;
            user.DeletedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
        }
    }
}
