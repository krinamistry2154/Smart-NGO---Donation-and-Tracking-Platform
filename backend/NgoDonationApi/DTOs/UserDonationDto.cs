namespace NgoDonationApi.DTOs
{
    public class UserDonationDto
    {
        public int Id { get; set; }
        public required string CauseTitle { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public required string Status { get; set; }
        public required List<UsageDetail> Usage { get; set; }
    }
}
