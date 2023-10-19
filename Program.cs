using Dating_App.Data;
using Dating_App.Extensions;
using Dating_App.Interfaces;
using Dating_App.Services;
using Microsoft.EntityFrameworkCore;
using System.Text;

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

// The order in which you add middleware is important!
app.UseCors(builder => builder.AllowAnyHeader().AllowAnyMethod().WithOrigins(CORS_PORT));

// this middleware is used to check if the request has a valid token
app.UseAuthentication();

// this middleware is used to check if the user is authorized to access a resource
app.UseAuthorization();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
