using Dating_App.Entities;
using Dating_App.Interfaces;
using Microsoft.EntityFrameworkCore;

// User Repository: provides abstraction for data access layer 
namespace Dating_App.Data.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;

        public UserRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.Id == id);

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
