using Microsoft.EntityFrameworkCore;
using NgoDonationApi.Models;

namespace NgoDonationApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Cause> Causes { get; set; }
        public DbSet<Donation> Donations { get; set; }
        public DbSet<Volunteer> Volunteers { get; set; }
        public DbSet<ContactMessage> ContactMessages { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Expenditure> Expenditures { get; set; }
    }
}