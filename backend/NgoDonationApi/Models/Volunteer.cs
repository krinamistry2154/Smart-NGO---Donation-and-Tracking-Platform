using System.ComponentModel.DataAnnotations;

namespace NgoDonationApi.Models
{
    public class Volunteer
    {
        [Key]
        public int VolunteerId { get; set; }

        [Required]
        public required string FullName { get; set; }

        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        public required string Phone { get; set; }

        public required string Skills { get; set; }
        // 🔥 ADD THIS
        public bool IsApproved { get; set; } = false;

        public DateTime AppliedAt { get; set; } = DateTime.Now;
    }
}