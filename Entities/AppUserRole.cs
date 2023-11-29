using Microsoft.AspNetCore.Identity;

namespace Dating_App.Entities
{
    // Entity that serves as a bridge table for users and roles
    public class AppUserRole : IdentityUserRole<int>
    {
        public AppUser User { get; set; }

        public AppRole Role { get; set; }
    }
}
