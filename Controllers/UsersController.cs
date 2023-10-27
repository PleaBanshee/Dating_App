using Dating_App.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Dating_App.Interfaces;
using AutoMapper;
using Dating_App.DTOs;

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
            var users = await _userRepository.GetUsersAsync();

            // Mapping the users to MemberDto
            var usersToReturn = _mapper.Map<IEnumerable<MemberDto>>(users);

            // returns status code and users
            return Ok(usersToReturn);
        }

        [HttpGet("{username}")] // api/users/{username}
        public async Task<ActionResult<MemberDto>> GetUser(string userName)
        {
            var user = await _userRepository.GetUserByUsernameAsync(userName);

            return _mapper.Map<MemberDto>(user);
        }

        [HttpGet("{id:int}")] // api/users/{id}
        public async Task<ActionResult<MemberDto>> GetUser(int id)
        {
            var user =  await _userRepository.GetUserByIdAsync(id);

            return _mapper.Map<MemberDto>(user);
        }
    }
}
