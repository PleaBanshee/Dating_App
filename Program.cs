using Dating_App.Data;
using Dating_App.Entities;
using Dating_App.Extensions;
using Dating_App.Middleware;
using Dating_App.SignalR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
var CORS_PORT = "https://localhost:4200";

// Add services to the container. Check ApplicationServicesExtensions
builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddIdentityServices(builder.Configuration);
    
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Exception handling middleware at top, errors need to be handled first
app.UseMiddleware<ExceptionMiddleware>();

// The order in which you add middleware is important!
app.UseCors(builder => builder.AllowAnyHeader().AllowAnyMethod().WithOrigins(CORS_PORT));

// this middleware is used to check if the request has a valid token
app.UseAuthentication();

// this middleware is used to check if the user is authorized to access a resource
app.UseAuthorization();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
// Maps requests to the hub
app.MapHub<PresenceHub>("hubs/presence");

// using keyword ensures that the object is disposed of when it's no longer needed
// Provides access to all services in this class
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
    // asynchronously applies migrations to the db
    await context.Database.MigrateAsync();
    // Seeds the db
    await Seed.SeedUsers(userManager,roleManager);
}
catch (Exception ex)
{
    var logger = services.GetService<ILogger>();
    logger.LogError(ex, "An error occurred during DB migration");
}

app.Run();
