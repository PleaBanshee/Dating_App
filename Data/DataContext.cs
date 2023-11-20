using Dating_App.Entities;
using Microsoft.EntityFrameworkCore;

namespace Dating_App.Data;

// Inherits from DbContext
// Use this class for data that can be queried
public class DataContext: DbContext
{
    public DataContext(DbContextOptions options) : base(options)
    {

    }

    public DbSet<AppUser> Users { get; set; }

    public DbSet<UserLike> Likes { get; set; }

    // This method is used to configure the database, and is an overridden method from DbContext
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
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
    }
}

