using Dating_App.Entities;
using Dating_App.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Dating_App.Services
{
    public class TokenService : ITokenService
    {
        private readonly SymmetricSecurityKey _key;

        public TokenService(IConfiguration config)
        {
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
        }

        public string CreateToken(AppUser user)
        {
            // claims are the data we want to store inside the token (in this case the id and username)
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.NameId, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName)
            };

            var credentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            // token descriptor contains the claims, expiry date and signing credentials
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7), // token expires after 7 days
                SigningCredentials = credentials
            };

            // token handler creates the token based on the token descriptor
            var tokenHandler = new JwtSecurityTokenHandler();

            // create the token
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}