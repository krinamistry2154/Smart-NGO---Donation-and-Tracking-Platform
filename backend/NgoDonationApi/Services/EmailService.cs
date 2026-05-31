using System;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;
using MimeKit.Text;

namespace NgoDonationApi.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendDonationEmailAsync(string toEmail, string userName, decimal amount, string causeName)
        {
            try
            {
                var emailSettings = _config.GetSection("EmailSettings");
                var senderEmail = emailSettings["SenderEmail"] ?? "your-ngo-email@gmail.com";
                var senderPassword = emailSettings["SenderPassword"] ?? "your-app-password";
                var smtpServer = emailSettings["SmtpServer"] ?? "smtp.gmail.com";
                var smtpPort = int.Parse(emailSettings["SmtpPort"] ?? "587");

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("NGO Donation System", senderEmail));
                message.To.Add(new MailboxAddress(userName, toEmail));
                message.Subject = "Thank You for Your Donation!";

                string emailBody = $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <title>Donation Confirmation</title>
</head>
<body style='margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,sans-serif;'>

    <table width='100%' cellpadding='0' cellspacing='0' style='background-color:#f4f6f9;padding:30px 0;'>
        <tr>
            <td align='center'>

                <table width='650' cellpadding='0' cellspacing='0' 
                       style='background:#ffffff;border-radius:12px;overflow:hidden;
                              box-shadow:0 4px 15px rgba(0,0,0,0.08);'>

                    <!-- Header -->
                    <tr>
                        <td align='center'
                            style='background:linear-gradient(135deg,#2c7be5,#00b894);
                                   padding:35px;color:white;'>

                            <h1 style='margin:0;font-size:30px;'>
                                Thank You ❤️
                            </h1>

                            <p style='margin-top:10px;font-size:16px;opacity:0.95;'>
                                Your generosity is creating real change.
                            </p>
                        </td>
                    </tr>

                    <!-- Greeting -->
                    <tr>
                        <td style='padding:40px 35px 20px 35px;color:#333;'>

                            <h2 style='margin-top:0;color:#2c7be5;'>
                                Dear {userName},
                            </h2>

                            <p style='font-size:16px;line-height:1.8;color:#555;'>
                                Thank you for supporting our mission with your generous contribution.
                                Your donation helps us provide resources, care, and hope to people who truly need it.
                            </p>

                            <p style='font-size:16px;line-height:1.8;color:#555;'>
                                Together, we are building a brighter future and making a meaningful impact in our community.
                            </p>

                        </td>
                    </tr>

                    <!-- Donation Details -->
                    <tr>
                        <td style='padding:0 35px 20px 35px;'>

                            <table width='100%' cellpadding='12' cellspacing='0'
                                   style='border:1px solid #e5e7eb;
                                          border-radius:10px;
                                          background:#f9fafc;'>

                                <tr>
                                    <td colspan='2'
                                        style='font-size:20px;
                                               font-weight:bold;
                                               color:#2c7be5;
                                               padding-bottom:15px;'>

                                        Donation Details
                                    </td>
                                </tr>

                                <tr>
                                    <td style='font-weight:bold;color:#444;width:35%;'>
                                        Donation Amount
                                    </td>

                                    <td style='color:#111;'>
                                        ₹{amount:N2}
                                    </td>
                                </tr>

                                <tr style='background:#ffffff;'>
                                    <td style='font-weight:bold;color:#444;'>
                                        Supported Cause
                                    </td>

                                    <td style='color:#111;'>
                                        {causeName}
                                    </td>
                                </tr>

                                <tr>
                                    <td style='font-weight:bold;color:#444;'>
                                        Donation Date
                                    </td>

                                    <td style='color:#111;'>
                                        {DateTime.Now:MMMM dd, yyyy hh:mm tt}
                                    </td>
                                </tr>

                                <tr style='background:#ffffff;'>
                                    <td style='font-weight:bold;color:#444;'>
                                        Status
                                    </td>

                                    <td style='color:green;font-weight:bold;'>
                                        Successful
                                    </td>
                                </tr>

                            </table>

                        </td>
                    </tr>

                    <!-- Message -->
                    <tr>
                        <td style='padding:10px 35px 30px 35px;'>

                            <div style='background:#ecfdf5;
                                        border-left:5px solid #10b981;
                                        padding:18px;
                                        border-radius:8px;
                                        color:#065f46;
                                        font-size:15px;
                                        line-height:1.7;'>

                                Every contribution, big or small, helps us continue our work and
                                reach more lives. Your kindness and support inspire us to keep moving forward.
                            </div>

                        </td>
                    </tr>

                    <!-- CTA -->
                    <tr>
                        <td align='center' style='padding-bottom:35px;'>

                            <a href='https://yourwebsite.com'
                               style='background:#2c7be5;
                                      color:white;
                                      text-decoration:none;
                                      padding:14px 30px;
                                      border-radius:8px;
                                      font-size:16px;
                                      font-weight:bold;
                                      display:inline-block;'>

                                Visit Our Website
                            </a>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align='center'
                            style='background:#111827;
                                   color:#d1d5db;
                                   padding:25px;
                                   font-size:14px;'>

                            <p style='margin:0 0 8px 0;font-size:18px;color:white;'>
                                NGO Donation Platform
                            </p>

                            <p style='margin:0;line-height:1.7;'>
                                Thank you for being part of our mission to create positive change.
                            </p>

                            <p style='margin-top:15px;color:#9ca3af;font-size:13px;'>
                                © {DateTime.Now.Year} NGO Donation Platform. All Rights Reserved.
                            </p>

                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>
";

                message.Body = new TextPart(TextFormat.Html) { Text = emailBody };

                using var client = new SmtpClient();
                // For demo/development using gmail, allow less secure initially or use App Passwords
                await client.ConnectAsync(smtpServer, smtpPort, SecureSocketOptions.StartTls);

                // Note: you must replace dummy credentials with real ones in AppSettings
                if (senderPassword != "your-app-password")
                {
                    await client.AuthenticateAsync(senderEmail, senderPassword);
                    await client.SendAsync(message);
                }

                await client.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                // Log exception if needed
                Console.WriteLine($"Failed to send email: {ex.Message}");
            }
        }
    }
}