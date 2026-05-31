using Microsoft.AspNetCore.Mvc;
using NgoDonationApi.Data;

namespace NgoDonationApi.Controllers
{
    [Route("api/admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ Dashboard Stats
        [HttpGet("dashboard")]
        public IActionResult GetDashboard()
        {
            var totalCauses = _context.Causes.Count();
            var totalDonations = _context.Donations.Count();
            var totalVolunteers = _context.Volunteers.Count();
            var totalAmount = _context.Donations.Sum(d => d.Amount);

            return Ok(new
            {
                totalCauses,
                totalDonations,
                totalVolunteers,
                totalAmount
            });
        }
    }
}