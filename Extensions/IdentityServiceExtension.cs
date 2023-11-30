using Dating_App.Data;
using Dating_App.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Dating_App.Extensions
{
    public static class IdentityServiceExtension
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, 
            IConfiguration config) 
        {
            // TODO: set passwords to require alphanumeric characters
            // TODO: require user to register with email
            // Configures the Identity service
            services.AddIdentityCore<AppUser>(opt =>
            {
                opt.Password.RequireNonAlphanumeric = false;
            })
            .AddRoles<AppRole>()
            .AddRoleManager<RoleManager<AppRole>>()
            .AddEntityFrameworkStores<DataContext>();

            // Config Service: JWTs
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).
                AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"])),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });

            // Config Service: Authorization policies
            services.AddAuthorization(opt =>
            {
                opt.AddPolicy("RequiredAdminRole", policy => policy.RequireRole("Admin"));
                opt.AddPolicy("ModeratePhotoRole", policy => policy.RequireRole("Admin", "Moderator"));
            });

            return services;
        }
    }
}
