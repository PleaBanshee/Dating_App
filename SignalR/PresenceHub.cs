using Dating_App.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Dating_App.SignalR
{
    [Authorize]
    // Hub is a class that can be used to send messages to all connected clients
    public class PresenceHub: Hub
    {
        public override async Task OnConnectedAsync()
        {
            // Sends a message to other users that current user is online, using Claims
            await Clients.Others.SendAsync("UserIsOnline", Context.User.GetUsername());
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Clients.Others.SendAsync("UserIsOffline", Context.User.GetUsername());
            await base.OnDisconnectedAsync(exception);
        }
    }
}
