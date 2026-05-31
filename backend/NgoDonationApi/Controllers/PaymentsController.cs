using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NgoDonationApi.DTOs;
using Razorpay.Api;
using System.Security.Cryptography;
using System.Text;

namespace NgoDonationApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly RazorpayClient _razorpayClient;
        private readonly ILogger<PaymentsController> _logger;

        private readonly string _razorpayKeyId;
        private readonly string _razorpayKeySecret;

        public PaymentsController(
            IConfiguration configuration,
            ILogger<PaymentsController> logger)
        {
            _logger = logger;

            _razorpayKeyId = configuration["Razorpay:KeyId"]!;
            _razorpayKeySecret = configuration["Razorpay:KeySecret"]!;

            // ✅ Initialize Razorpay Client
            _razorpayClient = new RazorpayClient(
                _razorpayKeyId,
                _razorpayKeySecret
            );
        }

        /// <summary>
        /// Create Razorpay Order
        /// POST: api/payments/create-order
        /// </summary>
        [HttpPost("create-order")]
        [Authorize]
        public IActionResult CreateOrder([FromBody] RazorpayOrderDto orderDto)
        {
            try
            {
                // ✅ Validate DTO
                if (orderDto == null)
                {
                    return BadRequest(new
                    {
                        message = "Invalid request data"
                    });
                }

                // ✅ Validate Amount
                if (orderDto.Amount <= 0)
                {
                    return BadRequest(new
                    {
                        message = "Amount must be greater than 0"
                    });
                }

                // ✅ Default Currency
                if (string.IsNullOrWhiteSpace(orderDto.Currency))
                {
                    orderDto.Currency = "INR";
                }

                // ✅ Generate Receipt if null
                if (string.IsNullOrWhiteSpace(orderDto.Receipt))
                {
                    orderDto.Receipt = $"receipt_{DateTime.Now.Ticks}";
                }

                _logger.LogInformation(
                    "Creating Razorpay order for Amount: {Amount}",
                    orderDto.Amount
                );

                // ✅ Razorpay Options
                Dictionary<string, object> options = new Dictionary<string, object>
                {
                    { "amount", Convert.ToInt32(orderDto.Amount * 100) }, // paise
                    { "currency", orderDto.Currency },
                    { "receipt", orderDto.Receipt },
                    { "payment_capture", 1 }
                };

                // ✅ Create Order
                Order order = _razorpayClient.Order.Create(options);

                // ✅ Safely read values
                string orderId = order.Attributes["id"].ToString();
                string amount = order.Attributes["amount"].ToString();
                string currency = order.Attributes["currency"].ToString();
                string receipt = order.Attributes["receipt"].ToString();

                _logger.LogInformation(
                    "Razorpay order created successfully: {OrderId}",
                    orderId
                );

                return Ok(new
                {
                    success = true,
                    orderId = orderId,
                    amount = amount,
                    currency = currency,
                    receipt = receipt,
                    key = _razorpayKeyId
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while creating Razorpay order");

                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to create Razorpay order",
                    error = ex.Message
                });
            }
        }

        /// <summary>
        /// Verify Razorpay Payment
        /// POST: api/payments/verify
        /// </summary>
        [HttpPost("verify")]
        [Authorize]
        public IActionResult VerifyPayment(
            [FromBody] RazorpayVerificationDto verificationDto)
        {
            try
            {
                // ✅ Validate DTO
                if (verificationDto == null)
                {
                    return BadRequest(new
                    {
                        message = "Invalid verification data"
                    });
                }

                // ✅ Validate Required Fields
                if (string.IsNullOrWhiteSpace(verificationDto.RazorpayOrderId) ||
                    string.IsNullOrWhiteSpace(verificationDto.RazorpayPaymentId) ||
                    string.IsNullOrWhiteSpace(verificationDto.RazorpaySignature))
                {
                    return BadRequest(new
                    {
                        message = "Missing payment verification fields"
                    });
                }

                _logger.LogInformation(
                    "Verifying Payment: OrderId={OrderId}, PaymentId={PaymentId}",
                    verificationDto.RazorpayOrderId,
                    verificationDto.RazorpayPaymentId
                );

                // ✅ Generate Signature
                string generatedSignature = GenerateSignature(
                    verificationDto.RazorpayOrderId,
                    verificationDto.RazorpayPaymentId,
                    _razorpayKeySecret
                );

                // ✅ Verify Signature
                bool isValid = generatedSignature ==
                               verificationDto.RazorpaySignature;

                if (!isValid)
                {
                    _logger.LogWarning(
                        "Payment verification failed due to invalid signature"
                    );

                    return BadRequest(new
                    {
                        verified = false,
                        message = "Invalid payment signature"
                    });
                }

                _logger.LogInformation(
                    "Payment verified successfully: {PaymentId}",
                    verificationDto.RazorpayPaymentId
                );

                return Ok(new
                {
                    verified = true,
                    message = "Payment verified successfully",
                    paymentId = verificationDto.RazorpayPaymentId,
                    orderId = verificationDto.RazorpayOrderId
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while verifying payment");

                return StatusCode(500, new
                {
                    verified = false,
                    message = "Payment verification failed",
                    error = ex.Message
                });
            }
        }

        /// <summary>
        /// Generate Razorpay Signature
        /// </summary>
        private string GenerateSignature(
            string orderId,
            string paymentId,
            string secret)
        {
            string payload = $"{orderId}|{paymentId}";

            using (HMACSHA256 hmac = new HMACSHA256(
                Encoding.UTF8.GetBytes(secret)))
            {
                byte[] hash = hmac.ComputeHash(
                    Encoding.UTF8.GetBytes(payload));

                return BitConverter
                    .ToString(hash)
                    .Replace("-", "")
                    .ToLower();
            }
        }
    }
}