using Dating_App.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Dating_App.Controllers
{
    // Only admins with specified policies can access these methods
    public class AdminController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;

        public AdminController(UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }

        [Authorize(Policy = "RequiredAdminRole")]
        [HttpGet("users-with-roles")] // api/admin/users-with-roles
        public async Task<ActionResult> getUsersWithRoles()
        {
            var users = await _userManager.Users
                .OrderBy(u => u.UserName)
                // projection selects specific properties from each user and creates a new anonymous type
                .Select(u => new 
                {
                    u.Id,
                    Username = u.UserName,
                    Roles = u.userRoles.Select(u => u.Role.Name).ToList(),
                })
                .ToListAsync();

            return Ok(users);
        }

        // Should technically be a put request, but we want to return a status with content
        [Authorize(Policy = "RequiredAdminRole")]
        [HttpPost("edit-roles/{username}")] // api/admin/edit-roles/{username}?roles={roles}
        public async Task<ActionResult> EditRoles(string username, [FromQuery] string roles)
        {
            if (string.IsNullOrEmpty(roles)) return BadRequest("Please select a role for user");

            var selectedRoles = roles.Split(",").ToArray();
            var user = await _userManager.FindByNameAsync(username);

            if (user == null) return NotFound("Could not find user");
            var userRoles = await _userManager.GetRolesAsync(user);
            // find roles not already present in userRoles
            var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

            if (!result.Succeeded) return BadRequest("Failed to add to roles");
            // remove roles that was not selected to be edited
            result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

            if (!result.Succeeded) return BadRequest("Failed to remove from roles");
            return Ok(await _userManager.GetRolesAsync(user));  
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photos-to-moderate")] // api/admin/photos-to-moderate
        public ActionResult GetPhotosForModeration() 
        {
            return Ok("Only admins or moderators can moderate photos");
        }
    }
}
