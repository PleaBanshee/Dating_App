using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Dating_App.Entities
{
    public class Seed
    {
        // UserManager class is used to manage users in the persistence store
        public static async Task SeedUsers(UserManager<AppUser> userManager)
        {
            // If there are any users in the database, don't execute
            if (await userManager.Users.AnyAsync()) return;

            var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");

            var users = JsonConvert.DeserializeObject<List<AppUser>>(userData);

            foreach (var user in users)
            {
                user.UserName = user.UserName.ToLower();
                // Creates and saves to DB
                await userManager.CreateAsync(user, "Pa$$w0rd");
            }
        }
    }
}
