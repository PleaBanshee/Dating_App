using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Dating_App.Interfaces;
using AutoMapper;
using Dating_App.DTOs;
using System.Security.Claims;

namespace Dating_App.Controllers
{
    
    [Authorize] // Requires authentication for all methods in this controller
    public class UsersController : BaseApiController // Inherits from BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        // Dependency Injection: injects the User Repository into the controller
        // Injection of Imapper for mapping objects
        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        [HttpGet] // api/users
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            var users = await _userRepository.GetMembersAsync();

            // returns status code and users
            return Ok(users);
        }

        [HttpGet("{username}")] // api/users/{username}
        public async Task<ActionResult<MemberDto>> GetUser(string userName)
        {
            return await _userRepository.GetMemberByUsernameAsync(userName);
        }

        [HttpGet("{id:int}")] // api/users/{id}
        public async Task<ActionResult<MemberDto>> GetUser(int id)
        {
            return await _userRepository.GetMemberByIdAsync(id);
        }

        [HttpPut] // api/users
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            //  extracts the username of the currently authenticated user from their claims
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userRepository.GetUserByUsernameAsync(username);

            if (user == null) return NotFound();

            _mapper.Map(memberUpdateDto, user);
            _userRepository.Update(user);

            if (await _userRepository.SaveAllAsync()) return NoContent(); // OK status for updates

            // TODO: return message or status for updating content with same values
            return BadRequest("Failed to update user");
        }
    }
}
