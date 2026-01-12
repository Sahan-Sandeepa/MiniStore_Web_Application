using MiniStore.Core.DTOs;
using MiniStore.Core.Entities;

namespace MiniStore.Core.Interfaces
{
    public interface IUserService
    {
        Task<User?> GetByUsernameAsync(string username);
        Task<User> CreateUserAsync(User user, string password);
        bool VerifyPassword(string password, byte[] hash, byte[] salt);
        string CreateRefreshToken();
        Task<List<AdminUserDto>> GetAllNonAdminUsersAsync();
        Task DisableUserAsync(Guid userId);
        Task EnableUserAsync(Guid userId);
        Task SoftDeleteUserAsync(Guid userId, Guid currentAdminId);

        Task SaveChangesAsync();

        Task<User?> GetByRefreshTokenAsync(string refreshToken);
    }
}
