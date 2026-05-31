namespace NgoDonationApi.Models
{
    public class DonationTrackingSummary
    {
        public decimal TotalReceived { get; set; }
        public decimal TotalUsed { get; set; }
        public decimal TotalRemaining { get; set; }
        public List<Expenditure> Expenditures { get; set; } = new List<Expenditure>();
        public List<CauseBreakdown> CauseBreakdown { get; set; } = new List<CauseBreakdown>();
    }
}
