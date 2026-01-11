using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MiniStore.Core.Interfaces;

[ApiController]
[Route("api/admin/users")]
[Authorize(Roles = "Admin")]
public class AdminUsersController : ControllerBase
{
    private readonly IUserService _users;

    public AdminUsersController(IUserService users)
    {
        _users = users;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllUsers()
    {
        return Ok(await _users.GetAllNonAdminUsersAsync());
    }

    [HttpPut("{id}/disable")]
    public async Task<IActionResult> DisableUser(Guid id)
    {
        await _users.DisableUserAsync(id);
        await _users.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("{id}/enable")]
    public async Task<IActionResult> EnableUser(Guid id)
    {
        await _users.EnableUserAsync(id);
        await _users.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var adminId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );

        await _users.SoftDeleteUserAsync(id, adminId);
        await _users.SaveChangesAsync();
        return NoContent();
    }
}
