using Dating_App.Extensions;
using Microsoft.AspNetCore.Identity;

namespace Dating_App.Entities
{
    // Inherits from IdentityUser for identity management
    public class AppUser : IdentityUser<int>
    {
        public DateOnly DateOfBirth { get; set; }

        public string FullName { get; set; }

        public DateTime Created { get; set; } = DateTime.UtcNow;

        public DateTime LastActive { get; set; } = DateTime.UtcNow;

        public string Gender { get; set; }

        public string Introduction { get; set; }

        public string LookingFor { get; set; }

        public string Interests { get; set; }

        public string City { get; set; }

        public string Country { get; set; }

        // This is a one-to-many relationship
        public ICollection<Photo> Photos { get; set; } = new List<Photo>();

        // This is a many-to-many relationship
        public ICollection<UserLike> LikedByUsers { get; set; } = new List<UserLike>();

        // This is a many-to-many relationship
        public ICollection<UserLike> LikedUsers { get; set; } = new List<UserLike>();

        public ICollection<Message> MessagesSent { get; set; } = new List<Message>();

        public ICollection<Message> MessagesReceived { get; set; } = new List<Message>();

        public ICollection<AppUserRole> userRoles { get; set; }

        public int GetAge() => DateOfBirth.CalculateAge();
    }
}
