namespace Dating_App.DTOs
{
    public class PhotoDto
    {
public int Id { get; set; }
        public string Url { get; set; }
        
        public bool IsApproved { get; set; }
        
        // Check if this is the main user profile pic
        public bool IsMain { get; set; }
    }
}
