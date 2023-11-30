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
                    Roles = u.userRoles.Select(u => u.Role).ToList(),
                })
                .ToListAsync();

            return Ok(users);
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photos-to-moderate")] // api/admin/photos-to-moderate
        public ActionResult GetPhotosForModeration() 
        {
            return Ok("Only admins or moderators can moderate photos");
        }
    }
}
