using Microsoft.AspNetCore.Mvc;
using NgoDonationApi.Data;

namespace NgoDonationApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetStats()
        {
            var totalUsers = _context.Users.Count();
            var totalCauses = _context.Causes.Count();
            var totalDonations = _context.Donations.Sum(x => (decimal?)x.Amount) ?? 0;
            var totalVolunteers = _context.Volunteers.Count();

            return Ok(new
            {
                totalUsers,
                totalCauses,
                totalDonations,
                totalVolunteers
            });
        }
    }
}