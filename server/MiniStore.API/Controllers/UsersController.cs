using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MiniStore.Core.Enums;
using MiniStore.Core.Interfaces;

namespace MiniStore.API.Controllers
{
    [ApiController]
    [Route("api/users")]
    [Authorize(Roles = "Admin")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _users;

        public UsersController(IUserService users)
        {
            _users = users;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            return Ok(await _users.GetAllUsersAsync());
        }

        [HttpPut("{id}/role")]
        public async Task<IActionResult> ChangeRole(Guid id, UserRole role)
        {
            var user = (await _users.GetAllUsersAsync())
                        .FirstOrDefault(u => u.Id == id);

            if (user == null) return NotFound();

            user.Role = role;
            await _users.SaveChangesAsync();

            return Ok("Role updated");
        }
    }
}
