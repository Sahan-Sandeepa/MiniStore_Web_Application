using MiniStore.Core.Entities;
using MiniStore.Core.Enums;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace MiniStore.Infrastructure.Data
{
    public static class AdminSeeder
    {
        public static async Task SeedAdminAsync(AppDbContext db)
        {
            if (await db.Users.AnyAsync(u => u.Role == UserRole.Admin))
                return;

            using var hmac = new HMACSHA256();

            var admin = new User
            {
                Id = Guid.NewGuid(),
                UserName = "admin",
                FullName = "System Admin",
                Role = UserRole.Admin,
                PasswordSalt = hmac.Key,
                PasswordHash = hmac.ComputeHash(
                    Encoding.UTF8.GetBytes("Admin@123")
                )
            };

            db.Users.Add(admin);
            await db.SaveChangesAsync();

            Console.WriteLine("✅ Admin user seeded (admin / Admin@123)");
        }
    }
}
