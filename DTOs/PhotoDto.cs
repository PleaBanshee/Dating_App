namespace Dating_App.DTOs
{
    public class PhotoDto
    {
        public int Id { get; set; }

        public string Url { get; set; }
        
        // Check if this is the main user profile pic
        public bool IsProfilePic { get; set; }

        public DateTime LastUpdated { get; set; }
    }
}
