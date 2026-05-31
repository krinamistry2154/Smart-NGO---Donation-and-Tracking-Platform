using System.ComponentModel.DataAnnotations;

namespace NgoDonationApi.Models
{
    public class Admin
    {
        public int AdminId { get; set; }

        [Required]
        public required string Email { get; set; }

        [Required]
        public required string Password { get; set; } // store hashed later
    }
}