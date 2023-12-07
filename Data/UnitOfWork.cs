using AutoMapper;
using Dating_App.Data.Repositories;
using Dating_App.Interfaces;

namespace Dating_App.Data
{
    // Implements the unit of work interface
    // Gets injected into controllers to pass repository context
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public UnitOfWork(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public IUserRepository UserRepository => new UserRepository(_context,_mapper);

        public IMessageRepository MessageRepository => new MessageRepository(_context,_mapper);

        public ILikesRepository LikesRepository => new LikesRepository(_context);

        public async Task<bool> Complete()
        {
            // Saves changes to DB if there are any changes
            // returns true if there are changes to DB
            return await _context.SaveChangesAsync() > 0;
        }

        public bool HasChanges()
        {
            return _context.ChangeTracker.HasChanges();
        }
    }
}
