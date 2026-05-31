import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import { Users, Award, Heart, Calendar } from 'lucide-react'
import ngoPeople from '../../assets/ngo-people-right.svg'
import ngoHeart from '../../assets/ngo-heart-right.svg'

function Volunteers() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    skills: '',
    availability: '',
  })

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) setFormData(prev => ({ ...prev, fullName: user.fullName || '', email: user.email || '' }))
  }, [])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/volunteers', formData)
      alert('Thank you — your volunteer application has been received!')
      setFormData({ fullName: '', email: '', phone: '', skills: '', availability: '' })
    } catch (err) {
      console.error(err)
      alert(err?.response?.data?.message || 'Submission failed, please try again.')
    }
  }

  const perks = [
    { icon: <Users size={22} />, title: 'Community Impact', desc: 'Work directly with communities to create lasting change.' },
    { icon: <Award size={22} />, title: 'Recognition', desc: 'Receive certificates and public recognition for your work.' },
    { icon: <Heart size={22} />, title: 'Supportive Team', desc: 'Join a diverse, friendly team of volunteers and staff.' },
    { icon: <Calendar size={22} />, title: 'Flexible Schedule', desc: 'Opportunities that fit evenings, weekends, and remote help.' },
  ]

  const gallery = [
    'https://theneighborhood-ashland.org/wp-content/uploads/2023/10/Volunteer102323-400x267.jpg',
    'https://asianngo.org/upload/magzine/articles/background/1546246775.jpg',
    'https://volunteervacationsblog.com/wp-content/uploads/2022/04/ngos.jpg',
    'https://img.freepik.com/premium-photo/person-holding-bag-labeled-volunteer-ngo-food-distribution-center_464863-19147.jpg',
  ]

  return (
    <div>
      {/* Hero */}
      <section className="hero-section text-white d-flex align-items-center" style={{
        minHeight: '40vh',
        background: `linear-gradient(180deg, rgb(255, 255, 255), rgb(255, 255, 255)), url(https://habitatnega.org/wp-content/uploads/2020/06/volunteer.jpg) center/cover no-repeat`,
        position: 'relative'
      }}>
        <img src={ngoPeople} alt="" style={{ position: 'absolute', right: '0', top: '0', opacity: 0.2, height: '100%', zIndex: 1 }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <h1 className="display-5 fw-bold text-white">Join Our Volunteer Community</h1>
              <p className="lead text-white opacity-95" style={{ maxWidth: '680px', margin: '0 auto' }}>Share your time, skills, and compassion — help us reach more people and strengthen communities.</p>
              <div className="mt-3">
                <a href="#apply" className="btn btn-success btn-lg me-3">Apply to Volunteer</a>
                <a href="#learn" className="btn btn-outline-light btn-lg">Learn More</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-5 perks-section" style={{ background: '#f9fafb', width: '100%', padding: '40px 16px' }}>
        <div className="container" style={{ width: '100%', maxWidth: '100%', margin: '0 auto' }}>
          <div className="perks-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {perks.map((p, i) => (
              <div className="perk-card" key={i} style={{ background: '#ffffff', boxShadow: '0 6px 20px rgba(0,0,0,0.12)', padding: '26px', borderRadius: '14px', border: '2px solid #f0f0f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minHeight: '200px' }}>
                <div className="icon-wrap" style={{ color: 'var(--primary)', display: 'inline-flex', marginBottom: '12px' }}>{p.icon}</div>
                <h5 className="fw-bold" style={{ color: '#111', margin: '12px 0 8px' }}>{p.title}</h5>
                <p className="mb-0" style={{ color: '#444', fontSize: '0.96rem' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main: form + info */}
      <section id="apply" className="py-5">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6 order-lg-1 order-2">
              <div className="card-modern volunteer-card p-4">
                <h3 className="fw-bold mb-3">Volunteer Application</h3>
                <p className="text-muted">Tell us about yourself and how you'd like to help. We'll be in touch within a week.</p>

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Full name</label>
                      <input name="fullName" value={formData.fullName} onChange={handleChange} required className="form-control input-surface" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input name="email" type="email" value={formData.email} onChange={handleChange} required className="form-control input-surface" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Phone</label>
                      <input name="phone" value={formData.phone} onChange={handleChange} className="form-control input-surface" />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Skills / Experience</label>
                      <input name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g. Teaching, Events, Fundraising" className="form-control input-surface" />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Availability</label>
                      <input name="availability" value={formData.availability} onChange={handleChange} placeholder="e.g. Weekends, Evenings, Remote" className="form-control input-surface" />
                    </div>
                  </div>

                  <button className="btn btn-primary mt-4 px-4 py-2" type="submit">Submit Application</button>
                </form>
              </div>
            </div>

            <div className="col-lg-6 order-lg-2 order-1">
              <div className="rounded overflow-hidden shadow-sm">
                <img src="https://habitatnega.org/wp-content/uploads/2020/06/volunteer.jpg" alt="volunteers" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-5" style={{ background: 'transparent' }}>
        <div className="container">
          <h4 className="fw-bold mb-4" id="learn">Volunteer Moments</h4>
          <div className="row g-3">
            {gallery.map((src, i) => (
              <div key={i} className="col-sm-6 col-md-3">
                <div className="rounded overflow-hidden shadow-sm">
                  <img src={src} alt={`gallery-${i}`} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Volunteers