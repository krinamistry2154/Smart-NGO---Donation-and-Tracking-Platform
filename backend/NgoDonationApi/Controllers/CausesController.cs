using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NgoDonationApi.Data;
using NgoDonationApi.Models;

namespace NgoDonationApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CausesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CausesController(AppDbContext context)
        {
            _context = context;
        }

        // ==========================
        // ✅ GET ALL
        // ==========================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var causes = await _context.Causes
                .OrderByDescending(x => x.CreatedAt)
                .Select(c => new
                {
                    c.CauseId,
                    c.Title,
                    c.Description,
                    c.GoalAmount,
                    c.RaisedAmount,
                    c.ImageUrl
                })
                .ToListAsync();

            return Ok(causes);
        }

        // ==========================
        // ✅ GET BY ID
        // ==========================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var cause = await _context.Causes
                .Where(c => c.CauseId == id)
                .Select(c => new
                {
                    c.CauseId,
                    c.Title,
                    c.Description,
                    c.GoalAmount,
                    c.RaisedAmount,
                    c.ImageUrl
                })
                .FirstOrDefaultAsync();

            if (cause == null)
                return NotFound(new { message = "Cause not found" });

            return Ok(cause);
        }

        // ==========================
        // ✅ CREATE
        // ==========================
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Cause cause)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // ✅ Prevent duplicate title
            var exists = await _context.Causes
                .AnyAsync(c => c.Title == cause.Title);

            if (exists)
                return BadRequest("Cause with same title already exists");

            cause.CreatedAt = DateTime.UtcNow;
            cause.RaisedAmount = 0;

            _context.Causes.Add(cause);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = cause.CauseId }, cause);
        }

        // ==========================
        // ✅ UPDATE
        // ==========================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Cause updatedCause)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var cause = await _context.Causes.FindAsync(id);

            if (cause == null)
                return NotFound(new { message = "Cause not found" });

            cause.Title = updatedCause.Title;
            cause.Description = updatedCause.Description;
            cause.GoalAmount = updatedCause.GoalAmount;
            cause.ImageUrl = updatedCause.ImageUrl;

            await _context.SaveChangesAsync();

            return Ok(cause);
        }

        // ==========================
        // ✅ DELETE
        // ==========================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var cause = await _context.Causes
                .Include(c => c.Donations)
                .Include(c => c.Expenditure) // ✅ IMPORTANT
                .FirstOrDefaultAsync(c => c.CauseId == id);

            if (cause == null)
                return NotFound(new { message = "Cause not found" });

            if (cause.Donations.Any())
                return BadRequest("Cannot delete cause with donations");

            if (cause.Expenditure.Any())
                return BadRequest("Cannot delete cause with expenditures");

            _context.Causes.Remove(cause);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cause deleted successfully" });
        }
    }
}