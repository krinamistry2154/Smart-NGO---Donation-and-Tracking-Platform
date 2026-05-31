import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, Wallet, Target } from "lucide-react";
import API from "../../services/api";

export default function MyDonations() {
  const [myDonations, setMyDonations] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
    if (userData) {
      setUser(userData);
      // Fetch user's donations
      API.get(`/donationtracking/user/${userData.userId}/donations`)
        .then((res) => setMyDonations(res.data))
        .catch((err) => {
          console.error(err);
          setMyDonations([]);
        });
    }
  }, []);

  const fmt = (v) => v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <h3>Please login to view your donations.</h3>
        </div>
      </div>
    );
  }

  // Calculate overall statistics
  const totalDonated = myDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const totalUtilized = myDonations.reduce((sum, d) => sum + (d.usage?.reduce((s, u) => s + u.amount, 0) || 0), 0);
  const totalRemaining = totalDonated - totalUtilized;
  const overallUtilization = totalDonated > 0 ? ((totalUtilized / totalDonated) * 100).toFixed(1) : 0;

  return (
    <div className="donate-page" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      {/* Hero Section */}
      <section className="donate-hero-top">
        <div className="container text-center">
          <h1 className="donate-page-title">My Donations</h1>
          <p className="donate-page-subtitle">Track your impact and see how your donations are making a real difference.</p>
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
            e.currentTarget.style.color = 'var(--primary-dark)';
            e.currentTarget.style.transform = 'translateX(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--primary)';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <ArrowLeft size={18} /> Back
        </button>

        {myDonations.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: 60,
            background: 'white',
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: 20 }}>💌</div>
            <h3 style={{ color: '#666', marginBottom: 10, fontWeight: '700' }}>No donations yet</h3>
            <p style={{ color: '#999', marginBottom: 30, fontSize: '1rem' }}>Start making a difference by donating to causes you care about.</p>
            <a href="/causes" style={{
              display: 'inline-block',
              padding: '12px 32px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: 8,
              fontWeight: '700',
              fontSize: '1rem'
            }}>Explore Causes</a>
          </div>
        ) : (
          <div>
            {/* Overall Summary */}
            <div className="row justify-content-center mb-5">
              <div className="col-lg-12">
                <div className="card-modern" style={{ background: 'white' }}>
                  <div className="row g-0">
                    {/* Left Gradient Section */}
                    <div className="col-md-5 d-flex flex-column justify-content-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '40px' }}>
                      <TrendingUp size={56} style={{ marginBottom: '24px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }} />
                      <h2 className="fw-bold" style={{ fontSize: '1.8rem', marginBottom: '8px', textShadow: '0 2px 8px rgba(0,0,0,0.3)', background: 'linear-gradient(135deg, #ffffff 0%, #f0f0ff 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>Your Impact</h2>
                      <p style={{ marginBottom: '30px', fontSize: '1rem', opacity: 0.95, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>Track all your contributions and see the real-world impact of your generosity.</p>
                    </div>

                    {/* Right Summary Cards */}
                    <div className="col-md-7 p-4 p-md-5" style={{ background: 'white' }}>
                      <h3 style={{ fontWeight: '700', marginBottom: '30px', color: '#333', fontSize: '1.3rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Summary</h3>
                      <div className="row g-4">
                        <div className="col-12">
                          <DonationSummaryItem label="Total Donated" value={`₹${fmt(totalDonated)}`} subtext={`${myDonations.length} cause${myDonations.length !== 1 ? 's' : ''}`} icon={<Target size={24} />} />
                        </div>
                        <div className="col-12">
                          <DonationSummaryItem label="Total Utilized" value={`₹${fmt(totalUtilized)}`} subtext={`${overallUtilization}% used`} icon={<Wallet size={24} />} />
                        </div>
                        <div className="col-12">
                          <DonationSummaryItem label="Remaining" value={`₹${fmt(totalRemaining)}`} subtext="Available for future" icon={<TrendingUp size={24} />} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Donations Cards */}
            <div className="row justify-content-center">
              <div className="col-lg-12">
                {myDonations.map((donation, idx) => {
            const totalUsed = donation.usage?.reduce((sum, u) => sum + u.amount, 0) || 0;
            const remaining = donation.amount - totalUsed;
            const usagePercentage = ((totalUsed / donation.amount) * 100).toFixed(1);
            const donationDate = donation.donationDate || donation.date || new Date().toISOString();

            return (
              <div key={donation.donationId || donation.id || idx} style={{ marginBottom: '24px' }}>
                  <div className="card-modern" style={{ background: 'white', overflow: 'hidden' }}>
                    <div className="row g-0">
                      {/* Left Gradient - Cause Details */}
                      <div className="col-md-5 d-flex flex-column justify-content-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '40px' }}>
                        <h2 className="fw-bold" style={{ fontSize: '1.6rem', marginBottom: '16px', textShadow: '0 2px 8px rgba(0,0,0,0.3)', background: 'linear-gradient(135deg, #ffffff 0%, #f0f0ff 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{donation.causeTitle || 'Unnamed Cause'}</h2>
                        <p style={{ marginBottom: '20px', opacity: 0.95, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>Donation ID: <strong>{donation.donationId}</strong></p>
                        <div style={{
                          background: 'rgba(255,255,255,0.2)',
                          padding: '16px',
                          borderRadius: '12px',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255,255,255,0.3)'
                        }}>
                          <small style={{ opacity: 0.9, fontSize: '1rem', fontWeight: '600', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>Total Donated</small>
                          <h3 style={{ marginBottom: 0, fontSize: '2rem', fontWeight: '800', background: 'linear-gradient(135deg, #ffffff 0%, #f0f0ff 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>₹{fmt(donation.amount)}</h3>
                        </div>
                        <div style={{
                          marginTop: '20px',
                          background: totalUsed === donation.amount ? '#d4edda' : '#fff3cd',
                          color: totalUsed === donation.amount ? '#155724' : '#856404',
                          padding: '12px 20px',
                          borderRadius: 20,
                          fontSize: '1rem',
                          fontWeight: '700',
                          textAlign: 'center'
                        }}>
                          {totalUsed === donation.amount ? '✅ Fully Utilized' : '⏳ In Progress'}
                        </div>
                      </div>

                      {/* Right Section - Details */}
                      <div className="col-md-7 p-4 p-md-5" style={{ background: 'white' }}>
                        <h4 style={{ fontWeight: '700', marginBottom: '24px', color: '#333', fontSize: '1.2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Donation Details</h4>
                        
                        {/* Grid of Details */}
                        <div className="row g-3 mb-4">
                          <div className="col-md-6 col-12">
                            <p style={{ margin: '0 0 8px 0', color: '#999', fontSize: '0.95rem', fontWeight: '500' }}>📅 Date Donated</p>
                            <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{new Date(donationDate).toLocaleDateString('en-IN')}</p>
                          </div>
                          <div className="col-md-6 col-12">
                            <p style={{ margin: '0 0 8px 0', color: '#999', fontSize: '0.95rem', fontWeight: '500' }}>✅ Amount Utilized</p>
                            <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>₹{fmt(totalUsed)}</p>
                          </div>
                          <div className="col-md-6 col-12">
                            <p style={{ margin: '0 0 8px 0', color: '#999', fontSize: '0.95rem', fontWeight: '500' }}>⏳ Pending Amount</p>
                            <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>₹{fmt(remaining)}</p>
                          </div>
                          <div className="col-md-6 col-12">
                            <p style={{ margin: '0 0 8px 0', color: '#999', fontSize: '0.95rem', fontWeight: '500' }}>📊 Utilization Rate</p>
                            <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{usagePercentage}%</p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ marginBottom: '24px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#666' }}>
                            <span>Fund Utilization</span>
                            <span>{usagePercentage}%</span>
                          </div>
                          <div style={{ width: '100%', height: 10, backgroundColor: '#e9ecef', borderRadius: 10, overflow: 'hidden' }}>
                            <div style={{
                              width: `${usagePercentage}%`,
                              height: '100%',
                              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                              transition: 'width 0.8s ease',
                              borderRadius: 10
                            }}></div>
                          </div>
                        </div>

                        {/* View Details Button */}
                        <button
                          onClick={() => {
                            // Show/hide usage breakdown
                          }}
                          style={{
                            width: '100%',
                            padding: '12px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(102,126,234,0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          View Fund Breakdown
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Usage Breakdown - Expandable */}
                  {donation.usage && donation.usage.length > 0 && (
                    <div style={{ marginTop: '20px', padding: '24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                      <h5 style={{ fontWeight: '700', marginBottom: '20px', color: 'white', fontSize: '1.1rem', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>📋 How Your Donation is Being Used</h5>
                      <div style={{ display: 'grid', gap: 12 }}>
                        {donation.usage.map((use, index) => {
                          const usagePercent = ((use.amount / donation.amount) * 100).toFixed(1);
                          return (
                            <div key={index} style={{
                              padding: 16,
                              backgroundColor: '#f8f9fa',
                              borderLeft: '4px solid #667eea',
                              borderRadius: 8,
                              transition: 'all 0.3s ease'
                            }} onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#f0f2f8';
                              e.currentTarget.style.borderLeftColor = '#764ba2';
                            }} onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#f8f9fa';
                              e.currentTarget.style.borderLeftColor = '#667eea';
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 10 }}>
                                <div>
                                  <h6 style={{ margin: 0, fontWeight: '700', color: '#333', fontSize: '1rem' }}>{use.description}</h6>
                                  <small style={{ color: '#666', fontSize: '0.95rem', fontWeight: '500' }}>📂 {use.category || 'General'}</small>
                                </div>
                                <strong style={{ color: '#667eea', fontSize: '1.2rem' }}>₹{fmt(use.amount)}</strong>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ flex: 1, height: 6, backgroundColor: '#e9ecef', borderRadius: 10, overflow: 'hidden' }}>
                                  <div style={{
                                    width: `${usagePercent}%`,
                                    height: '100%',
                                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                                    borderRadius: 10
                                  }}></div>
                                </div>
                                <small style={{ fontWeight: '600', color: '#667eea', minWidth: 45 }}>{usagePercent}%</small>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
              </div>
            );
          })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Summary Item Component for Summary Box
function DonationSummaryItem({ label, value, subtext, icon }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px',
      padding: '16px 0',
      borderBottom: '1px solid #f0f0f0'
    }}>
      <div style={{ color: '#667eea', fontSize: '1.8rem', flexShrink: 0, textShadow: '0 2px 8px rgba(102,126,234,0.3)' }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: '0 0 6px 0', color: '#999', fontSize: '0.95rem', fontWeight: '500' }}>{label}</p>
        <p style={{ margin: '0 0 4px 0', fontSize: '1.4rem', fontWeight: '800', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{value}</p>
        <p style={{ margin: 0, color: '#ccc', fontSize: '0.9rem' }}>{subtext}</p>
      </div>
    </div>
  );
}

// Summary Card Component
function SummaryCard({ title, value, subtext, icon, color }) {
  return (
    <div style={{
      background: 'white',
      padding: 24,
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      border: `2px solid transparent`
    }} onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
      e.currentTarget.style.borderColor = color;
    }} onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      e.currentTarget.style.borderColor = 'transparent';
    }}>
      <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{icon}</div>
      <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '0.9rem', fontWeight: '500' }}>{title}</p>
      <h4 style={{ margin: '0 0 6px 0', fontSize: '1.8rem', fontWeight: '800', color: color }}>{value}</h4>
      <p style={{ margin: 0, fontSize: '0.85rem', color: '#999' }}>{subtext}</p>
    </div>
  );
}

// Fund Detail Card Component
function FundDetailCard({ label, value, highlight }) {
  return (
    <div style={{
      padding: 16,
      backgroundColor: highlight ? '#f0f2f8' : '#f8f9fa',
      borderRadius: 8,
      borderLeft: highlight ? '4px solid #667eea' : 'none'
    }}>
      <p style={{ margin: '0 0 6px 0', color: '#666', fontSize: '0.9rem', fontWeight: '500' }}>{label}</p>
      <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', color: highlight ? '#667eea' : '#333' }}>{value}</p>
    </div>
  );
}