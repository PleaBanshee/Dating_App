﻿using Dating_App.Data;
using Dating_App.Interfaces;
using Dating_App.Services;
using Microsoft.EntityFrameworkCore;

namespace Dating_App.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, 
            IConfiguration config) 
        {
            services.AddCors(); // Cross-Origin Resource Sharing
            // use SQLite as the database provider, and it's specifying the connection
            // details using a connection string from the application's configuration.
            services.AddDbContext<DataContext>(options =>
                options.UseSqlite(config.GetConnectionString("DefaultConnection")));

            // Token Service: JWTs
            services.AddScoped<ITokenService, TokenService>();

            return services;
        }
    }
}