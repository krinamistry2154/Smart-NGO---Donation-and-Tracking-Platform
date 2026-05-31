// Configuration file for frontend environment variables
// All VITE_ prefixed variables are automatically exposed by Vite

export const config = {
  // API Configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "https://localhost:7002/api",

  // Email Configuration
  email: {
    sender: import.meta.env.VITE_EMAIL_SENDER || "",
    password: import.meta.env.VITE_EMAIL_PASSWORD || "",
    smtpServer: import.meta.env.VITE_SMTP_SERVER || "smtp.gmail.com",
    smtpPort: import.meta.env.VITE_SMTP_PORT || 587,
  },

  // Razorpay Configuration
  razorpay: {
    keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || "",
    keySecret: import.meta.env.VITE_RAZORPAY_KEY_SECRET || "",
  },
};

export default config;
