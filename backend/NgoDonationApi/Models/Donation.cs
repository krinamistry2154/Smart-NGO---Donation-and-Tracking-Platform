using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NgoDonationApi.Models
{
    public class Donation
    {
        [Key]
        public int DonationId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int CauseId { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        public string PaymentMethod { get; set; } = string.Empty;
        [StringLength(100)]
        public string? RazorpayPaymentId { get; set; }

        [StringLength(100)]
        public string? RazorpayOrderId { get; set; }


        public DateTime DonationDate { get; set; } = DateTime.Now;

        [ForeignKey("UserId")]
        public User? User { get; set; }

        [ForeignKey("CauseId")]
        public Cause? Cause { get; set; }
    }
}