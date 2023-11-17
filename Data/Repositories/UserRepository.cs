using AutoMapper;
using AutoMapper.QueryableExtensions;
using Dating_App.DTOs;
using Dating_App.Entities;
using Dating_App.Helpers;
using Dating_App.Interfaces;
using Microsoft.EntityFrameworkCore;

// User Repository: provides abstraction for data access layer, also includes querying
namespace Dating_App.Data.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        // Inject mapper to map entities to DTOs for more efficient querying
        public UserRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<MemberDto> GetMemberByUsernameAsync(string username)
        {
            return await _context.Users.Where(x => x.UserName == username)
                .ProjectTo<MemberDto>(_mapper.ConfigurationProvider).FirstOrDefaultAsync();
        }

        public async Task<MemberDto> GetMemberByIdAsync(int id)
        {
            return await _context.Users.Where(x => x.Id == id)
                .ProjectTo<MemberDto>(_mapper.ConfigurationProvider).FirstOrDefaultAsync();
        }

        // Get members with pagination details
        public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
        {
            var query = _context.Users.AsQueryable();

            query = query.Where(u => u.UserName != userParams.CurrentUsername);

            query = query.Where(u => u.Gender == userParams.Gender);

            var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MaxAge - 1));
            var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MinAge));

            query = query.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);

            // Order by created or last active, depending on user input
            query = userParams.OrderBy switch
            {
                "created" => query.OrderByDescending(u => u.Created),
                _ => query.OrderByDescending(u => u.LastActive)
            };

            // does not keep track of entity, improves performance and because the list is read-only
            return await PagedList<MemberDto>.CreateAsync(
                query.AsNoTracking().ProjectTo<MemberDto>(_mapper.ConfigurationProvider),
                userParams.PageNumber,
                userParams.PageSize
                );
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);

            return user;
        }

        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.UserName == username);

            return user;
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            // Include(): load the Photos entity along with the User entity
            var users = await _context.Users.Include(p => p.Photos).ToListAsync();

            return users;
        }

        public async Task<bool> SaveAllAsync()
        {
            // Saves changes to DB if there are any changes
            return await _context.SaveChangesAsync() > 0;
        }

        public void Update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }
    }
}
