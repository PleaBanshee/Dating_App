using AutoMapper;
using Dating_App.Data.Repositories;
using Dating_App.DTOs;
using Dating_App.Entities;
using Dating_App.Extensions;
using Dating_App.Helpers;
using Dating_App.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Dating_App.SignalR
{
    // Class that can be used to send messages to all connected clients
    [Authorize]
    public class MessageHub : Hub
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public MessageHub(IMessageRepository messageRepository, IUserRepository userRepository,
            IMapper mapper)
        {
            _messageRepository = messageRepository;
            _userRepository = userRepository;
            _mapper = mapper;
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

        public async Task SendMessage(CreateMessageDto createMessageDto)
        {
            var username = Context.User.GetUsername();

            if (username == createMessageDto.RecipientUsername.ToLower())
                throw new HubException("You cannot send messages to yourself");

            var sender = await _userRepository.GetUserByUsernameAsync(username);
            var recipient = await _userRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);

            if (recipient == null) throw new HubException("User not found");

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderUsername = sender.UserName,
                RecipientUsername = recipient.UserName,
                Content = createMessageDto.Content,
            };

            _messageRepository.AddMessage(message);

            // If message saved to DB, broadcast the new message
            if (await _messageRepository.SaveAllAsync())
            {
                var group = GetGroupName(sender.UserName, recipient.UserName);
                await Clients.Group(group).SendAsync("NewMessage", _mapper.Map<MessageDto>(message));
            }
            else
            {
                throw new HubException("Failed to send message");
            }
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
