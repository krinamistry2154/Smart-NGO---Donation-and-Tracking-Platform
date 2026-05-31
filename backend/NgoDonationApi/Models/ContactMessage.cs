using System.ComponentModel.DataAnnotations;

namespace NgoDonationApi.Models
{
    public class ContactMessage
    {
        [Key]
        public int ContactMessageId { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        public required string Subject { get; set; }

        [Required]
        public required string Message { get; set; }

        public DateTime SentAt { get; set; } = DateTime.Now;
    }
}