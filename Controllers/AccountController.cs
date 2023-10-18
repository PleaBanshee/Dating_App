using Dating_App.Data;
using Dating_App.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;

namespace Dating_App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;

        public AccountController(DataContext context)
        {
            _context = context;
        }

        [HttpPost("register")] // api/account/register?username={username}&password={password}
        public async Task<ActionResult<AppUser>> Register(string username, string password)
        {
            // using statement ensures that the object is disposed of when it's no longer needed
            using var hmac = new HMACSHA512();
            
            // password salt: is used to create a unique password hash for each user
            var user = new AppUser
            {
                UserName = username,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password)),
                PasswordSalt = hmac.Key
            };

            // Add user to the database
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return user;
        }

    }
}
