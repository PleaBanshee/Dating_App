namespace Dating_App.Interfaces
{
    // Interface for unit of work pattern.
    public interface IUnitOfWork
    {
        IUserRepository UserRepository { get; }

        IMessageRepository MessageRepository { get; }

        ILikesRepository LikesRepository { get; }

        // if one transaction fails in a repository, all the others should fail
        Task<bool> Complete();

        bool HasChanges();
    }
}
