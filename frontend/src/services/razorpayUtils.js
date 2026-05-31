import { config } from "../config";

/**
 * Create Razorpay order on backend
 * @param {Object} orderData - Order data
 * @param {number} orderData.amount - Amount in rupees (e.g., 500 for ₹500)
 * @param {string} orderData.receipt - Receipt/reference ID
 * @param {Function} api - Axios instance for API calls
 */
export const createRazorpayOrder = async (orderData, api) => {
  try {
    const amount = Number(orderData.amount);

    // Validate amount early on client side
    if (!amount || isNaN(amount) || amount <= 0) {
      throw new Error('Amount must be a number greater than 0');
    }

    const razorpayOrderDto = {
      amount: amount,
      currency: orderData.currency || 'INR',
      receipt: orderData.receipt || `donation-${Date.now()}`
    };

    console.log('Sending order creation request:', razorpayOrderDto);
    const response = await api.post('/Payments/create-order', razorpayOrderDto);
    console.log('Order creation response:', response.data);

    // Normalize response so callers can rely on consistent fields
    const data = response.data || {};
    const normalized = {
      id: data.id || data.orderId || data.order_id || data.razorpayOrderId,
      razorpayOrderId: data.id || data.orderId || data.order_id || data.razorpayOrderId,
      amount: data.amount ? Number(data.amount) : (razorpayOrderDto.amount ? Math.round(Number(razorpayOrderDto.amount) * 100) : undefined),
      amountInRupees: data.amount ? Number(data.amount) / 100 : razorpayOrderDto.amount,
      currency: data.currency || razorpayOrderDto.currency,
      receipt: data.receipt || razorpayOrderDto.receipt,
      raw: data
    };

    console.log('Normalized order response:', normalized);
    return normalized;
  } catch (error) {
    const resp = error.response;
    console.error('Error creating Razorpay order:', {
      message: error.message,
      status: resp?.status,
      data: resp?.data,
    });

    if (resp?.status === 404) {
      throw new Error(
        'Backend endpoint /api/Payments/create-order not found. ' +
        'Please ensure the PaymentsController with create-order action is implemented on the backend.'
      );
    }

    const serverMessage = resp?.data?.message || resp?.data;
    if (serverMessage) {
      throw new Error(typeof serverMessage === 'string' ? serverMessage : JSON.stringify(serverMessage));
    }

    throw error;
  }
};

/**
 * Initialize and open Razorpay payment gateway
 * @param {Object} options - Payment options
 * @param {string} options.orderId - Razorpay order ID from backend
 * @param {number} options.amount - Amount in rupees
 * @param {string} options.donorName - Name of the donor
 * @param {string} options.email - Email of the donor
 * @param {string} options.phone - Phone number of the donor
 * @param {string} options.description - Payment description
 * @param {Function} options.onSuccess - Callback on successful payment
 * @param {Function} options.onError - Callback on payment failure
 */
export const initiateRazorpayPayment = (options) => {
  const { orderId, amount, donorName, email, phone, description, onSuccess, onError } = options;

  // Load Razorpay script
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.async = true;
  
  script.onload = () => {
    const razorpayOptions = {
      key: config.razorpay.keyId,
      order_id: orderId, // Order ID from backend
      amount: Math.round(parseFloat(amount) * 100), // Amount in paise
      currency: 'INR',
      name: 'AAROHAN - NGO Donation Platform',
      description: description || 'Support verified causes',
      handler: function (response) {
        // Payment successful
        console.log('Payment handler response:', response);

        // Normalize and augment response with orderId from outer scope
        const augmented = {
          razorpay_payment_id: response.razorpay_payment_id || response.payment_id,
          razorpay_order_id: response.razorpay_order_id || response.order_id || orderId,
          razorpay_signature: response.razorpay_signature || response.signature
        };

        if (onSuccess) {
          onSuccess(augmented);
        }
      },
      prefill: {
        name: donorName,
        email: email,
        contact: phone,
      },
      notes: {
        purpose: description || 'Donation'
      },
      theme: {
        color: '#4f8cff', // Primary color
      },
      modal: {
        ondismiss: function () {
          // Payment cancelled
          if (onError) {
            onError(new Error('Payment cancelled by user'));
          }
        },
      },
    };

    const razorpay = new window.Razorpay(razorpayOptions);
    razorpay.open();
  };

  script.onerror = () => {
    if (onError) {
      onError(new Error('Failed to load Razorpay script'));
    }
  };

  document.body.appendChild(script);
};

/**
 * Verify payment signature with backend
 * @param {Object} paymentData - Payment data from Razorpay
 * @param {string} paymentData.razorpay_order_id - Order ID
 * @param {string} paymentData.razorpay_payment_id - Payment ID
 * @param {string} paymentData.razorpay_signature - Payment signature
 * @param {Function} api - Axios instance for API calls
 */
export const verifyRazorpayPayment = async (paymentData, api) => {
  try {
    // Normalize incoming field names (Razorpay returns snake_case)
    const orderId = paymentData.razorpay_order_id || paymentData.razorpayOrderId || paymentData.order_id;
    const paymentId = paymentData.razorpay_payment_id || paymentData.razorpayPaymentId || paymentData.payment_id;
    const signature = paymentData.razorpay_signature || paymentData.razorpaySignature || paymentData.signature;

    // Validate presence
    if (!orderId || !paymentId || !signature) {
      console.error('Missing verification fields', { orderId, paymentId, signature, paymentData });
      throw new Error('Missing payment verification fields');
    }

    // Build DTO using property names backend expects (PascalCase)
    const verificationDto = {
      RazorpayOrderId: orderId,
      RazorpayPaymentId: paymentId,
      RazorpaySignature: signature
    };

    console.log('Sending payment verification request:', verificationDto);
    const response = await api.post('/Payments/verify', verificationDto);
    console.log('Payment verification response:', response.data);
    return response.data;
  } catch (error) {
    const resp = error.response;
    console.error('Payment verification failed:', {
      message: error.message,
      status: resp?.status,
      data: resp?.data,
    });

    if (resp?.status === 404) {
      throw new Error(
        'Backend endpoint /api/Payments/verify not found. ' +
        'Please ensure the PaymentsController with verify action is implemented on the backend.'
      );
    }

    const serverMessage = resp?.data?.message || resp?.data;
    if (serverMessage) {
      throw new Error(typeof serverMessage === 'string' ? serverMessage : JSON.stringify(serverMessage));
    }

    throw error;
  }
};

export default {
  createRazorpayOrder,
  initiateRazorpayPayment,
  verifyRazorpayPayment,
};
