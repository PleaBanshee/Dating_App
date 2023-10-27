using System.ComponentModel.DataAnnotations.Schema;

namespace Dating_App.Entities
{
    // Entity framework will create a table called Photos
    [Table("Photos")]
    public class Photo
    {
        public int Id { get; set; }

        public string Url { get; set; }

        public string Title { get; set; }

        public bool ProfilePic { get; set; }

        // Image Id from Cloudinary
        public string PublicId { get; set; }

        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

        // A user can have many photos
        public int AppUserId { get; set; }

        public AppUser AppUser { get; set; }
    }
}