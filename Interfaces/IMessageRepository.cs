using Dating_App.DTOs;
using Dating_App.Entities;
using Dating_App.Helpers;

namespace Dating_App.Interfaces
{
    public interface IMessageRepository
    {
        void AddMessage(Message message);

        void DeleteMessage(Message message);

        Task<Message> GetMessage(int id);

        Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams);

        Task<IEnumerable<MessageDto>> GetMessageThread(string currentUserName, string recipientUserName);

        Task<bool> SaveAllAsync();
    }
}
