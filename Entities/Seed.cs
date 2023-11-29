using Dating_App.Data;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Security.Cryptography;
using System.Text;

namespace Dating_App.Entities
{
    public class Seed
    {
        public static async Task SeedUsers(DataContext context)
        {
            if (await context.Users.AnyAsync()) return; // If there are any users in the database, return

            var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");

            var users = JsonConvert.DeserializeObject<List<AppUser>>(userData);

            foreach (var user in users) 
            { 
                user.UserName = user.UserName.ToLower();
                context.Users.Add(user);
            }

            await context.SaveChangesAsync();
        }
    }
}
