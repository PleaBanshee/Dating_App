using Dating_App.DTOs;
using Dating_App.Entities;
using Dating_App.Helpers;

// User Repository Interface: extends the User Repository
namespace Dating_App.Interfaces
{
    public interface IUserRepository
    {
        void Update(AppUser user);

        Task<IEnumerable<AppUser>> GetUsersAsync();

        Task<AppUser> GetUserByIdAsync(int id);

        Task<AppUser> GetUserByUsernameAsync(string username);

        Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams);

        Task<MemberDto> GetMemberByUsernameAsync(string username);

        Task<MemberDto> GetMemberByIdAsync(int id);

        Task<string> GetUserGender(string username);
    }
}
