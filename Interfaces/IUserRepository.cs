﻿using Dating_App.DTOs;
using Dating_App.Entities;

// User Repository Interface: extends the User Repository
namespace Dating_App.Interfaces
{
    public interface IUserRepository
    {
        void Update(AppUser user);

        Task<bool> SaveAllAsync();

        Task<IEnumerable<AppUser>> GetUsersAsync();

        Task<AppUser> GetUserByIdAsync(int id);

        Task<AppUser> GetUserByUsernameAsync(string username);

        Task<IEnumerable<MemberDto>> GetMembersAsync();

        Task<MemberDto> GetMemberByUsernameAsync(string username);

        Task<MemberDto> GetMemberByIdAsync(int id);
    }
}
