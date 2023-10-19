using Dating_App.Entities;

namespace Dating_App.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(AppUser user);
    }
}
