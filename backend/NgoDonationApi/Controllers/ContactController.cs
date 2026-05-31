using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NgoDonationApi.Data;
using NgoDonationApi.Models;

namespace NgoDonationApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ContactController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ Send Message
        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] ContactMessage message)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            message.SentAt = DateTime.Now;

            await _context.ContactMessages.AddAsync(message);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Message sent successfully" });
        }

        // ✅ Get All
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var messages = await _context.ContactMessages
                .OrderByDescending(x => x.SentAt)
                .ToListAsync();

            return Ok(messages);
        }
    }
}