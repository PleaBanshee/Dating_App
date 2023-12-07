using Dating_App.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Dating_App.Data;

// Inherits from IdentityDbContext for identity management
// Specifies identity entities and their PK type
// Use this class for data that can be queried. Abstraction of database
// This class is a combination of unit of work and repository pattern
public class DataContext: IdentityDbContext<AppUser
    , AppRole, int, IdentityUserClaim<int>
    , AppUserRole, IdentityUserLogin<int>
    , IdentityRoleClaim<int>, IdentityUserToken<int>>
{
    public DataContext(DbContextOptions options) : base(options)
    {

    }

    public DbSet<UserLike> Likes { get; set; }

    public DbSet<Message> Messages { get; set; }

    public DbSet<Group> Groups { get; set; }

    public DbSet<Connection> Connections { get; set; }

    // This method is used to configure the database, and is an overridden method from DbContext
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        // Many-to-many relationship between users and roles 
        builder.Entity<AppUser>()
            .HasMany(role => role.userRoles)
            .WithOne(usr => usr.User)
            .HasForeignKey(u => u.UserId)
            .IsRequired();

        builder.Entity<AppRole>()
            .HasMany(user => user.userRoles)
            .WithOne(role => role.Role)
            .HasForeignKey(u => u.RoleId)
            .IsRequired();

        // This is a many-to-many relationship
        builder.Entity<UserLike>()
            .HasKey(k => new { k.SourceUserId, k.LikedUserId });
        // This is a many-to-many relationship
        builder.Entity<UserLike>()
            .HasOne(s => s.SourceUser)
            .WithMany(l => l.LikedUsers)
            .HasForeignKey(s => s.SourceUserId)
            .OnDelete(DeleteBehavior.Cascade);
        // This is a many-to-many relationship
        builder.Entity<UserLike>()
            .HasOne(s => s.LikedUser)
            .WithMany(l => l.LikedByUsers)
            .HasForeignKey(s => s.LikedUserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Message>()
            .HasOne(u => u.Recipient)
            .WithMany(m => m.MessagesReceived)
            .OnDelete(DeleteBehavior.Restrict); // Messages will not be deleted if a user is deleted
        builder.Entity<Message>()
            .HasOne(u => u.Sender)
            .WithMany(m => m.MessagesSent)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

