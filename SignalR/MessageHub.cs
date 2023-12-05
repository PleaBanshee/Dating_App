using Dating_App.Extensions;
using Dating_App.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace Dating_App.SignalR
{
    // Class that can be used to send messages to all connected clients
    public class MessageHub : Hub
    {
        private readonly IMessageRepository _messageRepository;

        public MessageHub(IMessageRepository messageRepository)
        {
            _messageRepository = messageRepository;
        }

        public override async Task OnConnectedAsync()
        {
            // Receives http context and queries user from query params
            var httpContext = Context.GetHttpContext();
            var otherUser = httpContext.Request.Query["user"].ToString();
            var groupName = GetGroupName(Context.User.GetUsername(), otherUser);

            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            var messages = await _messageRepository.GetMessageThread(Context.User.GetUsername(), otherUser);
            await Clients.Group(groupName).SendAsync("ReceiveMessageThread", messages);

            // Sends message to all connected clients in the Hub that user is online
            await Clients.Others.SendAsync("UserIsOnline", Context.User.GetUsername());
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            return base.OnDisconnectedAsync(exception);
        }

        private string GetGroupName(string caller, string other)
        {
            // Compare the two strings and returns the alphabetical order
            var stringCompare = string.CompareOrdinal(caller, other) < 0;

            // Returns the name of the group
            return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
        }
    }
}
