using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Dating_App.Controllers
{
    // Only admins with specified policies can access these methods
    public class AdminController : BaseApiController
    {
        [Authorize(Policy = "RequiredAdminRole")]
        [HttpGet("users-with-roles")] // api/admin/users-with-roles
        public ActionResult getUsersWithRoles() 
        {
            return Ok("Only admins can see all users");
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photos-to-moderate")] // api/admin/photos-to-moderate
        public ActionResult GetPhotosForModeration() 
        {
            return Ok("Only admins or moderators can moderate photos");
        }
    }
}
