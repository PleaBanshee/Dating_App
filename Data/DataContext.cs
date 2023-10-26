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
}

