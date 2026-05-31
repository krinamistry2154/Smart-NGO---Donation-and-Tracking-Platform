using System.ComponentModel.DataAnnotations;

namespace NgoDonationApi.Models
{
    public class Cause
    {
        [Key]
        public int CauseId { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        public decimal GoalAmount { get; set; }

        public decimal RaisedAmount { get; set; } = 0;

        [Required]
        public string ImageUrl { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public ICollection<Donation> Donations { get; set; } = new List<Donation>();
        public ICollection<Expenditure> Expenditure { get; set; } = new List<Expenditure>();
    }
}