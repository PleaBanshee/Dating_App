using Dating_App.Data;
using Dating_App.Helpers;
using Dating_App.Interfaces;
using Dating_App.Services;
using Dating_App.SignalR;
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

            // Registers AutoMapper, scans the assembly for mappings and profiles
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            // Registers Cloudinary Settings, fetches from appsettings
            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));

            // Registers Photo Service
            services.AddScoped<IPhotoService, PhotoService>();

            // Registers logging user activity service
            services.AddScoped<LogUserActivity>();

            // Registers Presence Hub: Real-Time Chat
            services.AddSignalR();

            // Registers presence tracker: available to whole app
            services.AddSingleton<PresenceTracker>();

            // Registers Unit of Work
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            return services;
        }
    }
}
