﻿using Dating_App.DTOs;
using Dating_App.Entities;
using Dating_App.Helpers;

namespace Dating_App.Interfaces
{
    public interface IMessageRepository
    {
        void AddMessage(Message message);

        void DeleteMessage(Message message);

        Task<Message> GetMessage(int id);

        Task<PagedList<MessageDto>> GetMessagesForUser();

        Task<IEnumerable<MessageDto>> GetMessageThread(int currentUserId, int recipientId);

        Task<bool> SaveAllAsync();
    }
}