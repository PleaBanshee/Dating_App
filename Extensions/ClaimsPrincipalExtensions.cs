using System.Security.Claims;

namespace Dating_App.Extensions
{
    // Extension method to return a user's id and name
    // When extracting info from the token, will return nameid and unique_name
    public static class ClaimsPrincipalExtensions
    {
        // this keyword indicates it is an extension method
        public static string GetUsername(this ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.Name)?.Value;
        }

        public static int GetUserId(this ClaimsPrincipal user)
        {
            return int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        }
    }
}
