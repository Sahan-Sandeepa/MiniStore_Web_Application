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
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _users.GetAllUsersAsync());
    }

    [HttpPut("{id}/disable")]
    public async Task<IActionResult> DisableUser(Guid id)
    {
        await _users.DisableUserAsync(id);
        return NoContent();
    }

    [HttpPut("{id}/enable")]
    public async Task<IActionResult> EnableUser(Guid id)
    {
        await _users.EnableUserAsync(id);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        await _users.SoftDeleteUserAsync(id);
        return NoContent();
    }
}
