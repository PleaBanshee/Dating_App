namespace Dating_App.Helpers
{
    // Class used to pass user pagination information to the API
    public class UserParams : PaginationParams
    {
        public string CurrentUsername { get; set; }

        public string Gender { get; set; }

        public int MinAge { get; set; } = 18;

        public int MaxAge { get; set; } = 100;

        public string OrderBy { get; set; } = "lastActive";
    }
}
