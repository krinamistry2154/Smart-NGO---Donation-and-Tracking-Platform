namespace NgoDonationApi.Models
{
    public class CauseBreakdown
    {
        public required string Cause { get; set; }
        public decimal Received { get; set; }
        public decimal Used { get; set; }
        public decimal Remaining { get; set; }

    }
}
