using Microsoft.AspNetCore.Identity;

namespace Dating_App.Entities
{
    // Inherits from identityRole for role management
    public class AppRole: IdentityRole<int>
    {
        public ICollection<AppUserRole> userRoles { get; set; }
    }
}
