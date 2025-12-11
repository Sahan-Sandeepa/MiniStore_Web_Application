using MiniStore.Core.Entities;


namespace MiniStore.Core.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(User user);
    }
}
