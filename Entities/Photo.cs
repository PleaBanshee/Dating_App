namespace Dating_App.Entities
{
    public class Photo
    {
        public int Id { get; set; }

        public string Url { get; set; }

        public string Title { get; set; }

        public bool ProfilePic { get; set; }

        // Image Id from Cloudinary
        public string PublicId { get; set; }

        public DateTime LastUpdated { get; set; }
    }
}