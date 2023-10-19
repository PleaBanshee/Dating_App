using Dating_App.Data;
using Dating_App.Interfaces;
using Dating_App.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
var CORS_PORT = "https://localhost:4200";

// Add services to the container.

// use SQLite as the database provider, and it's specifying the connection
// details using a connection string from the application's configuration.
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Token Service: JWTs
builder.Services.AddScoped<ITokenService, TokenService>();

builder.Services.AddControllers();
builder.Services.AddCors(); // Cross-Origin Resource Sharing
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

// The order in which you add middleware is important!
app.UseCors(builder => builder.AllowAnyHeader().AllowAnyMethod().WithOrigins(CORS_PORT));

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
