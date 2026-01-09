using MiniStore.Core.Entities;

namespace MiniStore.Core.Interfaces
{
    public interface IUserService
    {
        Task<User?> GetByUsernameAsync(string username);
        Task<User> CreateUserAsync(User user, string password);
        bool VerifyPassword(string password, byte[] hash, byte[] salt);
        string CreateRefreshToken();
        Task<List<User>> GetAllUsersAsync();

        Task DisableUserAsync(Guid id);
        Task EnableUserAsync(Guid id);
        Task SoftDeleteUserAsync(Guid id);

        Task SaveChangesAsync();

        Task<User?> GetByRefreshTokenAsync(string refreshToken);
    }
}
