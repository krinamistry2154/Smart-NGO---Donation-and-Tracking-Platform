import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, User, Mail, Phone, MessageCircle, CreditCard, AlertCircle } from 'lucide-react';
import { IndianRupeeIcon } from 'lucide-react';
import api from '../../services/api';
import { createRazorpayOrder, initiateRazorpayPayment, verifyRazorpayPayment } from '../../services/razorpayUtils';

function Donate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const causes = [
    { id: '1', title: "Food for Children" },
    { id: '2', title: "Education Support" },
    { id: '3', title: "Medical Help" },
    { id: '4', title: "Women Empowerment" },
    { id: '5', title: "Old Age Support" },
    { id: '6', title: "Disaster Relief" },
  ];

  const causeTitle = id
    ? (causes.find(c => c.id === id)?.title || `Cause #${id}`)
    : "General Donation";

  const [formData, setFormData] = useState({
    donorName: '',
    email: '',
    mobile: '',
    amount: '',
    message: '',
    paymentMethod: 'Razorpay'
  });

  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));

    if (user) {
      setUserId(user.userId);
      setFormData((prev) => ({
        ...prev,
        donorName: user.fullName || '',
        email: user.email || ''
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!userId) {
      setError("Please login first to make a donation.");
      navigate("/login");
      return;
    }

    // Validation
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError("Please enter a valid donation amount.");
      return;
    }

    if (!formData.mobile || formData.mobile.length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }

    // Create minimal payload for backend API (typed to match backend DTO)
    const donationData = {
      userId: String(userId),
      causeId: Number(id ? parseInt(id) : 1),
      amount: Number(parseFloat(formData.amount)),
      paymentMethod: String(formData.paymentMethod)
    };

    // If Razorpay, create order and initiate payment
    if (formData.paymentMethod === 'Razorpay') {
      try {
        setLoading(true);
        
        // Step 1: Create Razorpay order on backend
        console.log('Creating Razorpay order...');
        const orderResponse = await createRazorpayOrder(
          {
            amount: parseFloat(formData.amount),
            receipt: `donation-${userId}-${Date.now()}`
          },
          api
        );
        
        const orderId = orderResponse.id || orderResponse.razorpayOrderId;
        console.log('Order created:', orderId);
        
        setLoading(false);
        
        // Step 2: Open Razorpay with order ID
        initiateRazorpayPayment({
          orderId: orderId,
          amount: parseFloat(formData.amount),
          donorName: formData.donorName,
          email: formData.email,
          phone: formData.mobile,
          description: `Donation for ${causeTitle}`,
          onSuccess: async (paymentResponse) => {
            console.log('Payment successful, verifying...', paymentResponse);
            try {
              setLoading(true);

              // If signature is present, verify it with backend
              if (paymentResponse.razorpay_signature) {
                const verifyResponse = await verifyRazorpayPayment(
                  {
                    razorpay_order_id: paymentResponse.razorpay_order_id,
                    razorpay_payment_id: paymentResponse.razorpay_payment_id,
                    razorpay_signature: paymentResponse.razorpay_signature
                  },
                  api
                );

                console.log('Payment verified:', verifyResponse);
              } else {
                // Signature missing (some flows may omit it). Proceed to create donation
                console.warn('Razorpay signature missing; creating donation record without verification.');
              }

              // Build final donation payload and post
              const donationPayload = {
                userId: String(userId),
                causeId: Number(id ? parseInt(id) : 1),
                amount: Number(parseFloat(formData.amount)),
                paymentMethod: String(formData.paymentMethod),
                razorpayPaymentId: paymentResponse.razorpay_payment_id,
                razorpayOrderId: paymentResponse.razorpay_order_id,
                verificationPending: paymentResponse.razorpay_signature ? false : true
              };

              const donationResponse = await api.post('/Donations', donationPayload);

              alert(
                `Thank you, ${formData.donorName}! Your donation of ₹${formData.amount} was successful.`
              );
              console.log("Donation created:", donationResponse.data);

              setFormData({
                donorName: formData.donorName,
                email: formData.email,
                mobile: '',
                amount: '',
                message: '',
                paymentMethod: 'Razorpay'
              });

              setLoading(false);
              navigate("/my-donations");
            } catch (verifyError) {
              console.error('Payment verification/donation save failed:', verifyError);
              console.error('Donation save error response body:', verifyError.response?.data);
              setLoading(false);
              const serverMsg = verifyError.response?.data?.message || verifyError.response?.data;
              setError(
                serverMsg || verifyError.message || 'Payment failed. Please contact support.'
              );
            }
          },
          onError: (razorpayError) => {
            console.error('Razorpay error:', razorpayError);
            setLoading(false);
            setError('Payment failed: ' + razorpayError.message);
          },
        });
      } catch (error) {
        console.error('Error initiating payment:', error);
        setLoading(false);
        
        let errorMessage = error.message;
        if (error.response?.status === 404) {
          errorMessage = 'Backend payment endpoint not found (404). ' +
            'Please ensure the backend has /api/Payments/create-order endpoint implemented. ' +
            'See BACKEND_IMPLEMENTATION_GUIDE.md for details.';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        setError(errorMessage);
      }
      return;
    }

    // For other payment methods - send minimal payload
    try {
      setLoading(true);
      const payload = {
        userId: String(userId),
        causeId: Number(id ? parseInt(id) : 1),
        amount: Number(parseFloat(formData.amount)),
        paymentMethod: String(formData.paymentMethod)
      };

      const res = await api.post('/Donations', payload);

      alert(
        `Thank you, ${formData.donorName}! Your donation of ₹${formData.amount} was successful.`
      );

      console.log("Donation Response:", res.data);

      setFormData({
        donorName: formData.donorName,
        email: formData.email,
        mobile: '',
        amount: '',
        message: '',
        paymentMethod: 'Razorpay'
      });

      navigate("/my-donations");
    } catch (error) {
      console.error('API Error:', error);
      console.error('Error Response:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || "Donation failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donate-page" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      <section className="donate-hero-top">
        <div className="container text-center">
          <h1 className="donate-page-title">Donate</h1>
          <p className="donate-page-subtitle">Support verified causes — your contribution creates real impact.</p>
        </div>
      </section>
      <div className="container">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--primary)',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          onMouseEnter={(e) => {
            e.target.style.color = 'var(--primary-dark)';
            e.target.style.transform = 'translateX(-4px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = 'var(--primary)';
            e.target.style.transform = 'translateX(0)';
          }}
        >
          <ArrowLeft size={18} /> Back to Causes
        </button>

        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card-modern donate-card">
              <div className="row g-0">

                {/* Left Side - Summary */}
                <div className="col-md-5 donate-left d-flex flex-column justify-content-center" style={{ background: 'linear-gradient(135deg, #7dd3fc 0%, #60a5fa 100%)' }}>
                  <Heart size={56} style={{ marginBottom: '24px', animation: 'pulse 2s ease-in-out infinite' }} />
                  <h2 className="fw-bold donate-title">Make a Difference</h2>
                  {id && (
                    <h4 className="fw-bold mt-2 mb-3 donate-cause-title" style={{ fontSize: '1.3rem', opacity: 0.95 }}>{causeTitle}</h4>
                  )}
                  <p className="donate-subtitle">
                    {id
                      ? `You are donating to "${causeTitle}". Your generosity provides immediate support to those who need it most.`
                      : 'Your generosity provides immediate support to those who need it most.'}
                  </p>
                  <div className="donation-amount-box">
                    <small style={{ display: 'block', opacity: 0.8, marginBottom: '8px', fontSize: '0.9rem' }}>Donation Amount</small>
                    <h3 style={{ marginBottom: 0, fontSize: '1.8rem', fontWeight: '800' }}>₹ {formData.amount || '0.00'}</h3>
                  </div>
                </div>

                {/* Right Side - Form */}
                <div className="col-md-7 donate-right p-4 p-md-5" style={{ background: '#ffffff' }}>
                  <h3 className="donation-details-title">Donation Details</h3>
                  
                  {/* Error Message Display */}
                  {error && (
                    <div style={{
                      padding: '12px 16px',
                      marginBottom: '20px',
                      background: '#fee2e2',
                      border: '2px solid #ef4444',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      color: '#991b1b',
                    }}>
                      <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong>Error:</strong>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem' }}>{error}</p>
                      </div>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1a237e', marginBottom: '8px', display: 'block' }}>Full Name</label>
                        <div style={{ position: 'relative' }}>
                          <User size={18} style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--primary)',
                            pointerEvents: 'none',
                          }} />
                          <input
                            type="text"
                            className="form-control"
                            name="donorName"
                            value={formData.donorName}
                            onChange={handleChange}
                            placeholder="Full Name"
                            required
                            style={{
                              paddingLeft: '44px',
                              borderRadius: '12px',
                              border: '2px solid #e3e8ee',
                              fontSize: '1rem',
                              transition: 'all 0.3s ease',
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = 'var(--primary)';
                              e.target.style.boxShadow = '0 0 0 4px rgba(79,140,255,0.10)';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#e3e8ee';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </div>
                      </div>

                      <div className="col-md-6 mb-4">
                        <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1a237e', marginBottom: '8px', display: 'block' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                          <Mail size={18} style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--primary)',
                            pointerEvents: 'none',
                          }} />
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Your Email"
                            required
                            style={{
                              paddingLeft: '44px',
                              borderRadius: '12px',
                              border: '2px solid #e3e8ee',
                              fontSize: '1rem',
                              transition: 'all 0.3s ease',
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = 'var(--primary)';
                              e.target.style.boxShadow = '0 0 0 4px rgba(79,140,255,0.10)';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#e3e8ee';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1a237e', marginBottom: '8px', display: 'block' }}>Phone Number</label>
                        <div style={{ position: 'relative' }}>
                          <Phone size={18} style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--primary)',
                            pointerEvents: 'none',
                          }} />
                          <input
                            type="text"
                            className="form-control"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            placeholder="+91 9280..."
                            required
                            style={{
                              paddingLeft: '44px',
                              borderRadius: '12px',
                              border: '2px solid #e3e8ee',
                              fontSize: '1rem',
                              transition: 'all 0.3s ease',
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = 'var(--primary)';
                              e.target.style.boxShadow = '0 0 0 4px rgba(79,140,255,0.10)';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#e3e8ee';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </div>
                      </div>

                      <div className="col-md-6 mb-4">
                        <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--primary-dark)', marginBottom: '8px', display: 'block' }}>Amount (₹)</label>
                        <div style={{ position: 'relative' }}>
                          <IndianRupeeIcon size={18} style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--primary)',
                            pointerEvents: 'none',
                          }} />
                          <input
                            type="number"
                            className="form-control"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="500"
                            min="1"
                            step="1"
                            required
                            style={{
                              paddingLeft: '44px',
                              borderRadius: '12px',
                              border: '2px solid #e3e8ee',
                              fontSize: '1rem',
                              transition: 'all 0.3s ease',
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = 'var(--primary)';
                              e.target.style.boxShadow = '0 0 0 4px rgba(79,140,255,0.10)';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#e3e8ee';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1a237e', marginBottom: '8px', display: 'block' }}>Payment Method</label>
                      <div style={{ position: 'relative' }}>
                        <CreditCard size={18} style={{
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--primary)',
                          pointerEvents: 'none',
                          zIndex: 10,
                        }} />
                        <select
                          className="form-control"
                          name="paymentMethod"
                          value={formData.paymentMethod}
                          onChange={handleChange}
                          required
                          style={{
                            paddingLeft: '44px',
                            borderRadius: '12px',
                            border: '2px solid #e3e8ee',
                            fontSize: '1rem',
                            transition: 'all 0.3s ease',
                          }}
                          onFocus={(e) => {
                              e.target.style.borderColor = 'var(--primary)';
                              e.target.style.boxShadow = '0 0 0 4px rgba(79,140,255,0.10)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#e3e8ee';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          <option value="Razorpay">Razorpay (Recommended)</option>
                          <option value="UPI">UPI</option>
                          <option value="Card">Card</option>
                          <option value="Net Banking">Net Banking</option>
                          <option value="Cash">Cash</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1a237e', marginBottom: '8px', display: 'block' }}>Personal Message (Optional)</label>
                      <div style={{ position: 'relative' }}>
                        <MessageCircle size={18} style={{
                          position: 'absolute',
                          left: '12px',
                          top: '12px',
                          color: 'var(--primary)',
                          pointerEvents: 'none',
                        }} />
                        <textarea
                          className="form-control"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows="3"
                          placeholder="Leave a word of encouragement..."
                          style={{
                            paddingLeft: '44px',
                            borderRadius: '12px',
                            border: '2px solid #e3e8ee',
                            fontSize: '1rem',
                            transition: 'all 0.3s ease',
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = 'var(--primary)';
                            e.target.style.boxShadow = '0 0 0 4px rgba(79,140,255,0.10)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#e3e8ee';
                            e.target.style.boxShadow = 'none';
                          }}
                        ></textarea>
                      </div>
                    </div>

                    <button type="submit" className="btn-donate" disabled={loading}>
                      {loading ? 'Processing...' : 'Complete Donation'}
                    </button>

                    <p style={{ textAlign: 'center', color: '#999', fontSize: '0.85rem', marginTop: '16px' }}>
                      <small>🔒 Secure 256-bit SSL Encrypted Payment</small>
                    </p>
                  </form>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Donate;