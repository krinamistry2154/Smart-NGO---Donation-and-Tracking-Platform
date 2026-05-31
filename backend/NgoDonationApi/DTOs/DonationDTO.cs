namespace NgoDonationApi.DTOs
{
    public class DonationDto
    {
        public required string UserId { get; set; }
        public int CauseId { get; set; }
        public decimal Amount { get; set; }
        public required string PaymentMethod { get; set; }
        public string? RazorpayPaymentId { get; set; }  // NEW
        public string? RazorpayOrderId { get; set; }    // NEW
    }

    public class RazorpayOrderDto
    {
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "INR";
        public string Receipt { get; set; } = string.Empty;
    }

    public class RazorpayVerificationDto
    {
        public string RazorpayOrderId { get; set; } = string.Empty;
        public string RazorpayPaymentId { get; set; } = string.Empty;
        public string RazorpaySignature { get; set; } = string.Empty;
    }
}