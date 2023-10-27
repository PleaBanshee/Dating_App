using Dating_App.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Dating_App.Interfaces;

namespace Dating_App.Controllers
{
    
    [Authorize] // Requires authentication for all methods in this controller
    public class UsersController : BaseApiController // Inherits from BaseApiController
    {
        private readonly IUserRepository _userRepository;

        // Dependency Injection: injects the User Repository into the controller
        public UsersController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpGet] // api/users
        public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
        {
            return Ok(await _userRepository.GetUsersAsync());
        }

        [HttpGet("{username}")] // api/users/{username}
        public async Task<ActionResult<AppUser>> GetUser(string userName)
        {
            return await _userRepository.GetUserByUsernameAsync(userName);
        }

        [HttpGet("{id:int}")] // api/users/{id}
        public async Task<ActionResult<AppUser>> GetUser(int id)
        {
            return await _userRepository.GetUserByIdAsync(id);
        }
    }
}
