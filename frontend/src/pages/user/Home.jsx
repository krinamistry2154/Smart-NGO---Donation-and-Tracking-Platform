import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Users, ShieldCheck, ArrowRight } from 'lucide-react'
import CauseCard from '../../components/CauseCard'
import API from '../../services/api'
import heroImg from '../../assets/hero.png'
import ngoHand from '../../assets/ngo-hand-left.svg'
import ngoPeople from '../../assets/ngo-people-right.svg'

function Home() {
  const [stats, setStats] = useState({
    totalDonations: 5,
    totalVolunteers: 50,
    totalCauses: 6,
    loading: false
  });

  const causes = [
    { id: 1, title: 'Food for Children', description: 'Help provide nutritious meals to underprivileged children.', goal: 50000, raised: 22000, image: 'https://kishor-23.github.io/food-donate/img/p1.jpeg' },
    { id: 2, title: 'Education Support', description: 'Support books, fees and education materials for students.', goal: 100000, raised: 45000, image: 'https://64.media.tumblr.com/727835f05d0c1ec86281d22c9c11803e/tumblr_p613j8lTeK1wti3xao1_1280.jpg' },
    { id: 3, title: 'Medical Help', description: 'Support healthcare and emergency treatment for families.', goal: 150000, raised: 65000, image: 'https://i.pinimg.com/736x/35/e7/c3/35e7c3c70c3e5e7b3cf272b3ff898f14.jpg' }
  ]

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const dashboardRes = await API.get('/admin/dashboard');
        if (dashboardRes.data) {
          setStats({
            totalDonations: dashboardRes.data.totalDonations || 5,
            totalVolunteers: dashboardRes.data.totalVolunteers || 50,
            totalCauses: dashboardRes.data.totalCauses || 6,
            loading: false
          });
        }
      } catch (error) {
        console.log('Using default stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      {/* HERO */}
      <header className="home-hero hero-section text-white position-relative" style={{
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        backgroundImage: `linear-gradient(180deg, rgba(10,12,30,0.55), rgba(10,12,30,0.35)), url('https://img.freepik.com/premium-vector/ngo-volunteers-non-governmental-nonprofit-organizations-work-concept-humanitarian-aid-donation-international-support-solidarity-flat-vector-illustration-isolated-white-background_198278-21317.jpg?w=2000')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="home-bg" aria-hidden="true" style={{ display: 'none' }}>
          <img src="https://mantrafoundations.org/wp-content/uploads/2023/11/Donate-online.png" alt="" />
        </div>

        <div className="container" style={{ zIndex: 2 }}>
            <div style={{ maxWidth: 980, margin: '0 auto', textAlign: 'center' }}>
            <p className="hero-badge">Non-profit • Transparent • Impact</p>
            <h1 className="animate-fade-in" style={{ fontSize: '3.8rem', lineHeight: 1.02, margin: '12px 0 16px', fontWeight: 800, color: '#fff' }}>Transforming Lives, One Donation at a Time</h1>
            <p className="lead animate-fade-in" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', maxWidth: 820, margin: '0 auto 28px' }}>
              Join a community committed to transparent giving. Explore hand-picked causes, see exactly where funds go, and make measurable impact.
            </p>

            <div className="d-flex justify-content-center gap-3 flex-wrap animate-fade-in" style={{ marginBottom: 40 }}>
              <Link to="/causes" className="btn btn-primary btn-lg">Explore Causes</Link>
              <Link to="/donate" className="btn btn-secondary btn-lg">Donate Now</Link>
            </div>

            <div className="row g-3 justify-content-center" style={{ marginTop: 12, background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(10px)', padding: '20px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.2)', width: 'fit-content', margin: '12px auto 0' }}>
              <div className="col-auto">
                <div style={{ color: '#fff', textAlign: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{stats.totalDonations}</h3>
                  <small style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}>Total Donations</small>
                </div>
              </div>
              <div className="col-auto">
                <div style={{ color: '#fff', textAlign: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{stats.totalVolunteers}</h3>
                  <small style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}>Total Volunteers</small>
                </div>
              </div>
              <div className="col-auto">
                <div style={{ color: '#fff', textAlign: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{stats.totalCauses}</h3>
                  <small style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}>Active Causes</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <section style={{ padding: '48px 0', background: 'transparent' }}>
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card-modern p-4 animate-slide-up feature-box">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div className="feature-icon"><Heart size={22} /></div>
                  <h5 style={{ margin: 0, color: 'var(--text-light)' }}>Direct Aid</h5>
                </div>
                <p style={{ margin: 0, color: 'rgba(232,228,243,0.8)' }}>Funds go directly to verified projects and on-ground teams.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card-modern p-4 animate-slide-up feature-box" style={{ animationDelay: '0.06s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div className="feature-icon"><Users size={22} /></div>
                  <h5 style={{ margin: 0, color: 'var(--text-light)' }}>Community Driven</h5>
                </div>
                <p style={{ margin: 0, color: 'rgba(232,228,243,0.8)' }}>Local leaders and volunteers ensure projects are culturally appropriate and sustainable.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card-modern p-4 animate-slide-up feature-box" style={{ animationDelay: '0.12s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div className="feature-icon"><ShieldCheck size={22} /></div>
                  <h5 style={{ margin: 0, color: 'var(--text-light)' }}>Verified</h5>
                </div>
                <p style={{ margin: 0, color: 'rgba(232,228,243,0.8)' }}>Every listed cause is vetted for transparency and impact.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CAUSES */}
      <section className="container py-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold" style={{ color: 'var(--primary-dark)' }}>Featured Causes</h2>
          <p style={{ margin: 0, color: 'rgba(232,228,243,0.8)' }}>Small contributions add up to big change.</p>
          <div style={{ marginTop: 8 }}>
            <Link to="/causes" className="text-decoration-none d-inline-block" style={{ color: 'var(--primary)', fontWeight: 700 }}>View All <ArrowRight size={16} /></Link>
          </div>
        </div>

        <div className="row g-4">
          {causes.map((c, i) => (
            <div key={c.id} className="col-lg-4 col-md-6 d-flex" style={{ animation: `slideUp 0.6s ease-out ${i * 0.08}s backwards` }}>
              <CauseCard cause={c} />
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}

export default Home