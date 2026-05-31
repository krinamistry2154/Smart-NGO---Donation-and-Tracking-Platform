import React, { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import API from '../../services/api'

function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const payload = {
      name: formData.fullName,
      email: formData.email,
      subject: formData.subject,
      message: formData.message
    }

    try {
      const res = await API.post('/contact', payload)
      console.log('Contact submit response:', res.data)
      alert('Message Sent Successfully!')
      setFormData({ fullName: '', email: '', subject: '', message: '' })
    } catch (err) {
      console.error('Contact submit error:', err)
      setError(err.response?.data?.message || err.message || 'Failed to send message')
      alert('Failed to send message: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ paddingTop: '40px', paddingBottom: '60px', background: 'transparent', minHeight: '100vh' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '60px', animation: 'slideUp 0.8s ease-out 0.1s backwards' }}>
              <Mail size={56} style={{ color: 'var(--primary)', marginBottom: '20px' }} />
              <h2 className="fw-bold" style={{ fontSize: '2.8rem', color: 'var(--primary-white)', marginBottom: '12px', letterSpacing: '-1px' }}>Get in Touch</h2>
              <p style={{ fontSize: '1.1rem', color: '#fffdfd', maxWidth: '600px', margin: '0 auto' }}>We'd love to hear from you. Send us a message and we'll respond as quickly as possible.</p>
            </div>

            <div className="row g-4" style={{ animation: 'slideUp 0.8s ease-out 0.2s backwards' }}>
              {/* Contact Info Cards */}
              <div className="col-md-6">
                <div 
                  style={{
                      background: 'rgba(79,140,255,0.06)',
                    border: '2px solid var(--primary)',
                    borderRadius: '16px',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(214, 217, 222, 0.69)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Mail size={32} style={{ color: 'var(--primary)', marginBottom: '12px' }} />
                  <h5 style={{ fontWeight: '700', color: 'var(--primary-white)', marginBottom: '8px' }}>Email</h5>
                  <p style={{ color: '#fffafa', marginBottom: 0 }}>info@ngodonation.org</p>
                </div>
              </div>
              <div className="col-md-6">
                <div 
                  style={{
                      background: 'rgba(79,140,255,0.06)',
                      border: '2px solid rgba(79,140,255,0.24)',
                    borderRadius: '16px',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(79,140,255,0.16)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                    <Phone size={32} style={{ color: 'var(--primary)', marginBottom: '12px' }} />
                    <h5 style={{ fontWeight: '700', color: 'var(--primary-white)', marginBottom: '8px' }}>Phone</h5>
                  <p style={{ color: '#fffafa', marginBottom: 0 }}>+1 (234) 567-890</p>
                </div>
              </div>
              <div className="col-md-6">
                <div 
                  style={{
                    background: 'rgba(26, 35, 126, 0.1)',
                    border: '2px solid #1a237e',
                    borderRadius: '16px',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(26, 35, 126, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <MapPin size={32} style={{ color: '#1a237e', marginBottom: '12px' }} />
                  <h5 style={{ fontWeight: '700', color: '#f8f8f9', marginBottom: '8px' }}>Address</h5>
                  <p style={{ color: '#fffafa', marginBottom: 0 }}>Vadodara, Gujarat, India</p>
                </div>
              </div>
              <div className="col-md-6">
                <div 
                  style={{
                      background: 'rgba(79,140,255,0.06)',
                    border: '2px solid var(--primary)',
                    borderRadius: '16px',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(79,140,255,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Send size={32} style={{ color: 'var(--primary)', marginBottom: '12px' }} />
                  <h5 style={{ fontWeight: '700', color: 'var(--primary-white)', marginBottom: '8px' }}>Hours</h5>
                  <p style={{ color: '#fffafa', marginBottom: 0 }}>Mon - Fri, 9am - 6pm</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div 
              className="card-modern contact-card"
              style={{
                background: 'linear-gradient(135deg, #e6f7ff 0%, #d9f0ff 100%)',
                border: '1px solid rgba(3,105,161,0.12)',
                borderRadius: '24px',
                padding: '40px',
                marginTop: '60px',
                boxShadow: '0 8px 32px rgba(3,105,161,0.08)',
                animation: 'slideUp 0.8s ease-out 0.3s backwards',
              }}
            >
              <h3 style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--primary-dark)', marginBottom: '24px', letterSpacing: '-0.5px' }}>Send us a Message</h3>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1a237e', marginBottom: '8px', display: 'block' }}>Full Name</label>
                    <input 
                      type="text" 
                      className="form-control"
                      name="fullName" 
                      value={formData.fullName}
                      onChange={handleChange} 
                      placeholder="Your Full Name"
                      required
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #e3e8ee',
                        fontSize: '1rem',
                        padding: '12px 16px',
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
                  <div className="col-md-6 mb-4">
                    <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1a237e', marginBottom: '8px', display: 'block' }}>Email Address</label>
                    <input 
                      type="email"
                      className="form-control"
                      name="email" 
                      value={formData.email}
                      onChange={handleChange} 
                      placeholder="your@email.com"
                      required
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #e3e8ee',
                        fontSize: '1rem',
                        padding: '12px 16px',
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
                <div className="mb-4">
                  <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1a237e', marginBottom: '8px', display: 'block' }}>Subject</label>
                  <input 
                    type="text"
                    className="form-control"
                    name="subject" 
                    value={formData.subject}
                    onChange={handleChange} 
                    placeholder="What is this about?"
                    required
                    style={{
                      borderRadius: '12px',
                      border: '2px solid #e3e8ee',
                      fontSize: '1rem',
                      padding: '12px 16px',
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
                <div className="mb-4">
                  <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1a237e', marginBottom: '8px', display: 'block' }}>Message</label>
                  <textarea 
                    className="form-control"
                    rows="5" 
                    name="message"
                    value={formData.message}
                    onChange={handleChange} 
                    placeholder="Your message..."
                    required
                    style={{
                      borderRadius: '12px',
                      border: '2px solid #e3e8ee',
                      fontSize: '1rem',
                      padding: '12px 16px',
                      transition: 'all 0.3s ease',
                      fontFamily: 'var(--sans)',
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
                <button 
                  type="submit"
                    style={{
                    width: '100%',
                    padding: '14px 20px',
                    fontWeight: '700',
                    fontSize: '1.05rem',
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
                    boxShadow: '0 4px 16px rgba(79,140,255,0.28)',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 24px rgba(79,140,255,0.36)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 16px rgba(79,140,255,0.28)';
                  }}
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact