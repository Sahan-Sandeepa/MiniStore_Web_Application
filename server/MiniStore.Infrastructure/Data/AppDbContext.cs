using Microsoft.EntityFrameworkCore;
using MiniStore.Core.Entities;

namespace MiniStore.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Product> Products => Set<Product>();
        public DbSet<User> Users { get; set; }

    }
}
