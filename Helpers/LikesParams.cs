namespace Dating_App.Helpers
{
    // Class used to pass likes pagination information to the API
    public class LikesParams : PaginationParams
    {
        public int UserId { get; set; }

        public string Predicate { get; set; }
    }
}
