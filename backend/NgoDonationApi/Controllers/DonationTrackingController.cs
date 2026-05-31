using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NgoDonationApi.Data;
using NgoDonationApi.DTOs;
using NgoDonationApi.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace NgoDonationApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DonationTrackingController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DonationTrackingController(AppDbContext context)
        {
            _context = context;
        }

        // =======================
        // ✅ GET: Admin Summary
        // =======================
        [HttpGet("admin/summary")]
        public async Task<IActionResult> GetDonationTrackingSummary()
        {
            try
            {
                var totalReceived = await _context.Donations.SumAsync(d => d.Amount);
                var totalUsed = await _context.Expenditures.SumAsync(e => e.Amount);
                var totalRemaining = totalReceived - totalUsed;

                // ✅ Efficient grouping (DB level)
                var causeBreakdown = await _context.Donations
                    .GroupBy(d => new { d.CauseId, d.Cause.Title })
                    .Select(g => new CauseBreakdown
                    {
                        Cause = g.Key.Title,
                        Received = g.Sum(x => x.Amount),
                        Used = _context.Expenditures
                            .Where(e => e.CauseId == g.Key.CauseId)
                            .Sum(e => (decimal?)e.Amount) ?? 0,
                        Remaining = g.Sum(x => x.Amount) -
                            (_context.Expenditures
                                .Where(e => e.CauseId == g.Key.CauseId)
                                .Sum(e => (decimal?)e.Amount) ?? 0)
                    })
                    .ToListAsync();

                // ✅ Latest expenditures
                var expenditures = await _context.Expenditures
                    .OrderByDescending(e => e.Date)
                    .Take(10)
                    .Select(e => new
                    {
                        e.Id,
                        e.Description,
                        e.Amount,
                        e.Date,
                        e.Category,
                        e.CauseId
                    })
                    .ToListAsync();

                return Ok(new
                {
                    totalReceived,
                    totalUsed,
                    totalRemaining,
                    causeBreakdown,
                    expenditures
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // =======================
        // ✅ GET: User Donations
        // =======================
        [HttpGet("user/{userId}/donations")]
        public async Task<IActionResult> GetUserDonations(int userId)
        {
            try
            {
                var donations = await _context.Donations
                    .Where(d => d.UserId == userId)
                    .Include(d => d.Cause)
                    .OrderByDescending(d => d.DonationDate)
                    .ToListAsync();

                var result = donations.Select(d => new UserDonationDto
                {
                    Id = d.DonationId,
                    CauseTitle = d.Cause!.Title,
                    Amount = d.Amount,
                    Date = d.DonationDate,

                    // ✅ FIXED: Correct mapping
                    Status = _context.Expenditures
                        .Any(e => e.CauseId == d.CauseId)
                        ? "In Use"
                        : "Pending",

                    Usage = _context.Expenditures
                        .Where(e => e.CauseId == d.CauseId)
                        .Select(e => new UsageDetail
                        {
                            Description = e.Description,
                            Amount = e.Amount,
                            Category = e.Category,
                            Date = e.Date
                        }).ToList()
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // =======================
        // ✅ POST: Add Expenditure
        // =======================
        [HttpPost("admin/expenditures")]
        public async Task<IActionResult> AddExpenditure([FromBody] Expenditure model)
        {
            try
            {
                if (model == null)
                    return BadRequest("Invalid data");

                if (model.Amount <= 0)
                    return BadRequest("Amount must be greater than zero");

                if (string.IsNullOrWhiteSpace(model.Description))
                    return BadRequest("Description is required");

                // ✅ Validate Cause
                var causeExists = await _context.Causes
                    .AnyAsync(c => c.CauseId == model.CauseId);

                if (!causeExists)
                    return BadRequest("Invalid CauseId");

                model.Date = DateTime.UtcNow;

                _context.Expenditures.Add(model);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetDonationTrackingSummary), new
                {
                    message = "Expenditure added successfully",
                    data = model
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}