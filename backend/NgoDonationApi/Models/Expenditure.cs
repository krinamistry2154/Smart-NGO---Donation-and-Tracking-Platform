using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NgoDonationApi.Models
{
    public class Expenditure
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Description { get; set; } = string.Empty;

        public decimal Amount { get; set; }

        public DateTime Date { get; set; }

        [Required]
        public string Category { get; set; } = string.Empty;

        // ✅ Make it optional
        public int? CauseId { get; set; }

        [ForeignKey("CauseId")]
        public Cause? Cause { get; set; }
    }
}