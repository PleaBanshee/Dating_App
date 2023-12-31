﻿using Dating_App.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Dating_App.Data
{
    public class Seed
    {
        public static async Task ClearConnections(DataContext context)
        {
            // Deletes all data from Connections entity
            context.Connections.RemoveRange(context.Connections);
            await context.SaveChangesAsync();
        }

        // UserManager and Rolemanager classes used to manage users and roles in the persistence store
        public static async Task SeedUsers(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
        {
            // If there are any users in the database, don't execute
            if (await userManager.Users.AnyAsync()) return;

            var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");

            var users = JsonConvert.DeserializeObject<List<AppUser>>(userData);

            var roles = new List<AppRole>
            {
                new AppRole{Name = "Member"},
                new AppRole{Name = "Admin"},
                new AppRole{Name = "Moderator"},
            };

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }

            foreach (var user in users)
            {
                user.UserName = user.UserName.ToLower();
                // Use SpecifyKind() to prevent datetime errors in Postgres
                user.Created = DateTime.SpecifyKind(user.Created, DateTimeKind.Utc);
                user.LastActive = DateTime.SpecifyKind(user.LastActive, DateTimeKind.Utc);
                // Creates and saves to DB
                await userManager.CreateAsync(user, "Pa$$w0rd");
                await userManager.AddToRoleAsync(user, "Member");
            }

            var admin = new AppUser
            {
                UserName = "admin",
                City = "Washington",
                Country = "USA",
                DateOfBirth = DateOnly.FromDateTime(DateTime.UtcNow.AddYears(-35)),
                FullName = "Andrei Neagoie",
                Gender = "male",
                Interests = "Gaming, Programming",
                Introduction = "Hello, I'm Andrei",
                LookingFor = "Beefy Russian Women",
            };

            await userManager.CreateAsync(admin, "Pa$$w0rd");
            await userManager.AddToRolesAsync(admin, new[] { "Admin", "Moderator" });
        }
    }
}
