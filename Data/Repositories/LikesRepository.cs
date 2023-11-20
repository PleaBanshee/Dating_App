using Dating_App.DTOs;
using Dating_App.Entities;
using Dating_App.Interfaces;

namespace Dating_App.Data.Repositories
{
    public class LikesRepository : ILikesRepository
    {
        public Task<UserLike> GetUserLike(int sourceUserId, int likedUserId)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<LikeDto>> GetUserLikes(string predicate, int userId)
        {
            throw new NotImplementedException();
        }

        public Task<AppUser> GetUserWithLikes(int userId)
        {
            throw new NotImplementedException();
        }
    }
}
