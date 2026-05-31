using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NgoDonationApi.Data;
using NgoDonationApi.DTOs;
using NgoDonationApi.Models;
using NgoDonationApi.Services;
using Razorpay.Api;
using Microsoft.Extensions.Configuration;
using System.Security.Cryptography;
using System.Text;

namespace NgoDonationApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonationsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly EmailService _emailService;
        private readonly IConfiguration _configuration;

        public DonationsController(AppDbContext context, EmailService emailService, IConfiguration configuration)
        {
            _context = context;
            _emailService = emailService;
            _configuration = configuration;
        }

        // ✅ POST: api/Donations/CreateRazorpayOrder
        [HttpPost("CreateRazorpayOrder")]
        public IActionResult CreateRazorpayOrder([FromBody] RazorpayOrderDto dto)
        {
            if (dto.Amount <= 0)
                return BadRequest("Amount must be greater than 0");

            var key = _configuration["Razorpay:KeyId"];
            var secret = _configuration["Razorpay:KeySecret"];

            try
            {
                RazorpayClient client = new RazorpayClient(key, secret);

                Dictionary<string, object> options = new Dictionary<string, object>();
                options.Add("amount", dto.Amount * 100); // amount is in the smallest currency sub-unit (paise)
                options.Add("currency", dto.Currency);
                options.Add("receipt", string.IsNullOrEmpty(dto.Receipt) ? Guid.NewGuid().ToString() : dto.Receipt);
                options.Add("payment_capture", 1); // Auto capture

                Order order = client.Order.Create(options);

                return Ok(new
                {
                    orderId = order["id"].ToString(),
                    amount = order["amount"].ToString(),
                    currency = order["currency"].ToString()
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to create order.", error = ex.Message });
            }
        }

        // ✅ POST: api/Donations/VerifyPayment
        [HttpPost("VerifyPayment")]
        public IActionResult VerifyPayment([FromBody] RazorpayVerificationDto dto)
        {
            var secret = _configuration["Razorpay:KeySecret"];

            try
            {
                // To verify signature, we need to HMAC-SHA256 the payload (orderId + "|" + paymentId) using the secret
                string payload = $"{dto.RazorpayOrderId}|{dto.RazorpayPaymentId}";
                var actualSignature = GenerateSignature(payload, secret);

                if (actualSignature == dto.RazorpaySignature)
                {
                    return Ok(new { message = "Payment successful and verified." });
                }

                return BadRequest(new { message = "Invalid signature. Payment verification failed." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error verifying payment", error = ex.Message });
            }
        }

        private string GenerateSignature(string payload, string secret)
        {
            byte[] secretBytes = Encoding.UTF8.GetBytes(secret);
            byte[] payloadBytes = Encoding.UTF8.GetBytes(payload);

            using (HMACSHA256 hmac = new HMACSHA256(secretBytes))
            {
                byte[] hashBytes = hmac.ComputeHash(payloadBytes);
                return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
            }
        }

        // ✅ POST: api/Donations
        [HttpPost]
        public async Task<IActionResult> Donate([FromBody] DonationDto dto)
        {
            if (dto == null)
                return BadRequest(new { message = "Invalid donation data" });

            if (dto.Amount <= 0)
                return BadRequest(new { message = "Donation amount must be greater than 0" });

            if (string.IsNullOrWhiteSpace(dto.PaymentMethod))
                return BadRequest(new { message = "Payment method is required" });

            // ✅ Convert UserId string to int
            if (!int.TryParse(dto.UserId, out int userId))
            {
                return BadRequest(new { message = "Invalid UserId" });
            }

            // 🔍 Find Cause
            var cause = await _context.Causes
                .FirstOrDefaultAsync(c => c.CauseId == dto.CauseId);

            if (cause == null)
                return NotFound(new { message = "Cause not found" });

            // 🔍 Find User
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
                return NotFound(new { message = "User not found" });

            // 🧾 Create Donation
            var donation = new Donation
            {
                UserId = userId,
                CauseId = dto.CauseId,
                Amount = dto.Amount,
                PaymentMethod = dto.PaymentMethod,
                DonationDate = DateTime.Now,
                RazorpayPaymentId = dto.RazorpayPaymentId,
                RazorpayOrderId = dto.RazorpayOrderId
            };

            // 🔥 TRANSACTION START
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // 💰 Update Raised Amount
                cause.RaisedAmount += dto.Amount;

                // ➕ Save Donation
                await _context.Donations.AddAsync(donation);

                await _context.SaveChangesAsync();

                // ✅ Commit
                await transaction.CommitAsync();

                // 📧 Send Email asynchronously
                if (!string.IsNullOrEmpty(user.Email))
                {
                    _ = _emailService.SendDonationEmailAsync(
                        user.Email,
                        user.FullName,
                        donation.Amount,
                        cause.Title
                    );
                }

                return Ok(new
                {
                    message = "Donation successful",
                    donationId = donation.DonationId,
                    amount = donation.Amount,
                    userName = user.FullName,
                    causeTitle = cause.Title,
                    updatedRaisedAmount = cause.RaisedAmount
                });
            }
            catch (Exception ex)
            {
                // ❌ Rollback
                await transaction.RollbackAsync();

                return StatusCode(500, new
                {
                    message = "An error occurred during donation",
                    error = ex.Message
                });
            }
        }
        

        // ✅ GET: api/Donations
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var donations = await _context.Donations
                .Include(d => d.User)
                .Include(d => d.Cause)
                .OrderByDescending(d => d.DonationDate)
                .Select(d => new
                {
                    d.DonationId,
                    d.Amount,
                    d.PaymentMethod,
                    d.DonationDate,
                    d.UserId,
                    UserName = d.User != null ? d.User.FullName : null,
                    d.CauseId,
                    CauseTitle = d.Cause != null ? d.Cause.Title : null
                })
                .ToListAsync();

            return Ok(donations);
        }
    }
}