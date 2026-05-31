using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NgoDonationApi.Data;
using NgoDonationApi.Models;
using Microsoft.AspNetCore.Authorization;

namespace NgoDonationApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VolunteersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VolunteersController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ Apply
        [HttpPost]
        public async Task<IActionResult> Apply([FromBody] Volunteer volunteer)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            volunteer.IsApproved = false;
            volunteer.AppliedAt = DateTime.Now;

            await _context.Volunteers.AddAsync(volunteer);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Volunteer application submitted" });
        }

        // ✅ Get All
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var volunteers = await _context.Volunteers
                .OrderByDescending(x => x.AppliedAt)
                .ToListAsync();

            return Ok(volunteers);
        }

        // 🔥 Approve Volunteer (ADMIN ONLY)
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/approve")]
        public async Task<IActionResult> Approve(int id)
        {
            var volunteer = await _context.Volunteers.FindAsync(id);
            if (volunteer == null)
                return NotFound();

            volunteer.IsApproved = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Volunteer approved" });
        }

        // 🔥 Reject (optional but useful)
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/reject")]
        public async Task<IActionResult> Reject(int id)
        {
            var volunteer = await _context.Volunteers.FindAsync(id);
            if (volunteer == null)
                return NotFound();

            volunteer.IsApproved = false;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Volunteer rejected" });
        }

        // 🔥 Delete
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var volunteer = await _context.Volunteers.FindAsync(id);
            if (volunteer == null)
                return NotFound();

            _context.Volunteers.Remove(volunteer);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Deleted successfully" });
        }
    }
}