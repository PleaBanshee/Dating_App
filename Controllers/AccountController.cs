using AutoMapper;
using Dating_App.Data;
using Dating_App.DTOs;
using Dating_App.Entities;
using Dating_App.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace Dating_App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly ITokenService _tokenService;

        public AccountController(DataContext context, IMapper mapper, ITokenService tokenService)
        {
            _context = context;
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
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user),
                PhotoUrl = "",
                FullName = user.FullName,
                Gender = user.Gender,
            };
        }

        private async Task<bool> UserExists(string username)
        {
            // AnyAsync: returns a boolean value if the user exists
            return await _context.Users.AnyAsync(x => x.UserName == username.ToLower());
        }

        [HttpPost("login")] // api/account/login?username={username}&password={password}
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _context.Users
                .Include(p => p.Photos) // link to Photos entity, otherwise the user's photo field will remain empty
                .SingleOrDefaultAsync(x => x.UserName == loginDto.Username.ToLower());

            if (user == null) return Unauthorized("Invalid username");

            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsProfilePic)?.Url,
                FullName = user.FullName,
                Gender = user.Gender,
            };
        }
    }
}
