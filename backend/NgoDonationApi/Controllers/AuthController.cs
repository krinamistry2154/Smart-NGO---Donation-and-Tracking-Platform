using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NgoDonationApi.Data;
using NgoDonationApi.DTOs;
using NgoDonationApi.Models;
using NgoDonationApi.Services;

namespace NgoDonationApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwtService;

        public AuthController(AppDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public IActionResult Register(RegisterDto dto)
        {
            try
            {
                if (_context.Users.Any(x => x.Email == dto.Email))
                    return BadRequest("Email already exists");

                var user = new User
                {
                    FullName = dto.FullName,
                    Email = dto.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    Role = "User"
                };

                _context.Users.Add(user);
                _context.SaveChanges();

                return Ok(new { message = "Registration successful" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("login")]
        public IActionResult Login(LoginDto dto)
        {
            try
            {
                var user = _context.Users.FirstOrDefault(x => x.Email == dto.Email);

                if (user == null)
                    return Unauthorized("Invalid email or password");

                var verified = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

                if (!verified)
                    return Unauthorized("Invalid email or password");

                var token = _jwtService.GenerateToken(user);

                return Ok(new
                {
                    token,
                    user.UserId,
                    user.FullName,
                    user.Email,
                    user.Role
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("admin-only")]
        public IActionResult AdminOnly()
        {
            return Ok("Welcome Admin 🔥");
        }
    }
}