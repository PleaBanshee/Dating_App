using AutoMapper;
using Dating_App.DTOs;
using Dating_App.Entities;
using Dating_App.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Dating_App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;
        private readonly ITokenService _tokenService;

        public AccountController(UserManager<AppUser> userManager, IMapper mapper, ITokenService tokenService)
        {
            _userManager = userManager;
            _mapper = mapper;
            _tokenService = tokenService;
        }

        [HttpPost("register")] // api/account/register?username={username}&password={password}
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.Username)) return BadRequest("This user already exists");

            var user = _mapper.Map<AppUser>(registerDto); // maps the registerDto to an AppUser object

            user.UserName = registerDto.Username.ToLower();

            // Add user to the database
            var result = await _userManager.CreateAsync(user,registerDto.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            var roleResult = await _userManager.AddToRoleAsync(user, "Member");

            if (!roleResult.Succeeded) return BadRequest(result.Errors);

            return new UserDto
            {
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                PhotoUrl = "",
                FullName = user.FullName,
                Gender = user.Gender,
            };
        }

        private async Task<bool> UserExists(string username)
        {
            // AnyAsync: returns a boolean value if the user exists
            var user = await _userManager.Users.SingleOrDefaultAsync(x => x.UserName == username.ToLower());
            return user != null;
        }

        [HttpPost("login")] // api/account/login?username={username}&password={password}
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users
                .Include(p => p.Photos) // link to Photos entity, otherwise the user's photo field will remain empty
                .SingleOrDefaultAsync(x => x.UserName == loginDto.Username.ToLower());

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if (user == null || !result) return Unauthorized("Invalid credentials");

            return new UserDto
            {
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsProfilePic)?.Url,
                FullName = user.FullName,
                Gender = user.Gender,
            };
        }
    }
}
