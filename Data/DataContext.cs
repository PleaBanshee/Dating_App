using Dating_App.Entities;
using Microsoft.EntityFrameworkCore;

namespace Dating_App.Data;

// Inherits from DbContext
public class DataContext: DbContext
{
    public DataContext(DbContextOptions options) : base(options)
    {

    }

    public DbSet<AppUser> Users { get; set; }
}

