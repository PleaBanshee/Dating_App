namespace Dating_App.Entities
{
    // User connections on SignalR
    public class Connection
    {
        // Declare empty contstructor so there aren't any issues when creating migrations
        public Connection()
        {

        }

        public Connection(string connectionId, string username)
        {
            ConnectionId = connectionId;
            Username = username;
        }

        public string ConnectionId { get; set; }

        public string Username { get; set; }
    }
}
