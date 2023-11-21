using Dating_App.DTOs;
using Dating_App.Entities;
using Dating_App.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Dating_App.Data.Repositories
{
    public class LikesRepository : ILikesRepository
    {
        private readonly DataContext _context;

        public LikesRepository(DataContext context)
        {
            _context = context;
        }

        // Retrieves a UserLike entity based on the source user ID and liked user ID.
        public async Task<UserLike> GetUserLike(int sourceUserId, int likedUserId)
        {
            return await _context.Likes.FindAsync(sourceUserId, likedUserId);
        }

        // Retrieves a list of users based on a specified predicate and user ID.
        public async Task<IEnumerable<LikeDto>> GetUserLikes(string predicate, int userId)
        {
            var users = _context.Users.OrderBy(u => u.UserName).AsQueryable();

            var likes = _context.Likes.AsQueryable();

            if (predicate == "liked") 
            {
                likes = likes.Where(like => like.SourceUserId == userId);
                users = likes.Select(like => like.LikedUser);
            }

            if (predicate == "likedBy")
            {
                likes = likes.Where(like => like.LikedUserId == userId);
                users = likes.Select(like => like.SourceUser);
            }

            return await users.Select(user => new LikeDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Age = user.GetAge(),
                FullName = user.FullName,
                PhotoUrl = user.Photos.FirstOrDefault(p => p.IsProfilePic).Url,
                City = user.City
            }).ToListAsync();
        }

        // Retrieves a user along with its associated liked users.
        public async Task<AppUser> GetUserWithLikes(int userId)
        {
            return await _context.Users
                .Include(x => x.LikedUsers) // includes LikedUsers entity
                .FirstOrDefaultAsync(x => x.Id == userId);
        }
    }
}
