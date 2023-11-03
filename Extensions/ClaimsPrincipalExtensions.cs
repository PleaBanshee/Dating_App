using System.Security.Claims;

namespace Dating_App.Extensions
{
    // Extension method to return a user's name
    public static class ClaimsPrincipalExtensions
    {
        // this keyword indicates it is an extension method
        public static string GetUsername(this ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }
    }
}
