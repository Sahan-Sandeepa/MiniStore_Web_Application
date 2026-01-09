using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MiniStore.Core.Enums;
using MiniStore.Infrastructure.Data;

namespace MiniStore.API.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController(AppDbContext context) : ControllerBase
    {
        private readonly AppDbContext _context = context;

        [Authorize]
        [HttpPut("me/deactivate")]
        public async Task<IActionResult> DeactivateMyAccount()
        {
            var userId = Guid.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound();

            if (user.Status == UserStatus.Disabled)
                return BadRequest("Account is already deactivated");

            user.Status = UserStatus.Disabled;
            user.DeletedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Account deactivated successfully" });
        }
    }
}