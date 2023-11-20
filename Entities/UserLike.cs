namespace Dating_App.Entities
{
    // Serves as bridging entity (table) for many-to-many relationship
    public class UserLike
    {
        public AppUser SourceUser { get; set; }

        public int SourceUserId { get; set; }

        public AppUser LikedUser { get; set; }

        public int LikedUserId { get; set; }
    }
}