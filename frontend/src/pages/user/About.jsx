import React from 'react'
import { Award, Target, Eye, Heart, Zap, Users } from 'lucide-react'
import img from '../../assets/our-story.jpg'
import ngoHand from '../../assets/ngo-hand-left.svg'
import ngoHeart from '../../assets/ngo-heart-right.svg'
import ngoPeople from '../../assets/ngo-people-right.svg'

function About() {
  return (
    <div className="about-page">
      {/* --- Hero Section --- */}
      <section className="about-hero hero-section text-white text-center d-flex align-items-center justify-content-center position-relative overflow-hidden">
        <div className="about-bg" aria-hidden="true">
          <img src="https://media.istockphoto.com/id/1346470813/photo/shot-of-a-group-of-businesspeople-giving-the-thumbs-up.jpg?s=612x612&w=0&k=20&c=T_QhuU78MbLxIXhI06lBZSTgOQiwEekCr05pGzgW1Q4=" alt="" />
        </div>
        <div className="container about-hero-inner">
          <h1 className="about-title">Our Story</h1>
          <p className="about-subtitle">Empowering communities through transparent, compassionate action</p>
        </div>
      </section>

      {/* --- Main Content --- */}
      <div className="container about-content">
        {/* Story Section */}
        <div className="row justify-content-center mb-5 about-story-row">
          <div className="col-12 col-lg-8">
            <div className="about-story-center">
              <div className="about-story-box">
                <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                  <img src={img} alt="Our Story" style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', maxHeight: '300px' }} />
                </div>
                <h2 className="about-heading">Small Steps, Big Impact</h2>
                <div className="about-story-copy">
                  <p>Founded on the belief that compassion should be accessible to all, AAROHAN began as a small initiative to bridge the gap between those who wish to help and those in urgent need.</p>
                  <p>Today, we serve as a transparent digital gateway, ensuring that every rupee you donate reaches the grassroots level where it matters most—whether it's a child's classroom or a rural medical clinic.</p>
                  <p>Over the years we've partnered with local leaders, NGOs, and community volunteers to deliver targeted programs in education, healthcare, clean water, and livelihood development. Our focus is on sustainable outcomes—we fund projects that create long-term change.</p>
                  <p>We also publish quarterly impact reports with stories from the field, financial breakdowns, and measurable outcomes so donors can see the direct results of their generosity.</p>

                  <div className="impact-stats">
                    <div className="impact-item">
                      <strong>12k+</strong>
                      <span>Lives Impacted</span>
                    </div>
                    <div className="impact-item">
                      <strong>500+</strong>
                      <span>Volunteers</span>
                    </div>
                    <div className="impact-item">
                      <strong>100%</strong>
                      <span>Transparency</span>
                    </div>
                  </div>

                  <p style={{ marginTop: 18 }}>
                    Want to help? Explore our verified causes or join our volunteer network — every contribution moves us closer to resilient communities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision Cards */}
        <div className="row g-4 mb-5" style={{ animation: 'slideUp 0.8s ease-out 0.2s backwards' }}>
          <div className="col-md-6">
            <div className="about-feature card-modern about-feature-card">
              <div className="d-flex align-items-center mb-4">
                <div className="about-feature-icon"><Target size={32} color="white" /></div>
                <h4 className="about-feature-title">Our Mission</h4>
              </div>
              <p className="about-feature-text">To mobilize resources and foster a culture of giving by providing a secure, transparent platform that connects global donors with local community needs.</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="about-feature card-modern about-feature-card">
              <div className="d-flex align-items-center mb-4">
                <div className="about-feature-icon"><Eye size={32} color="#fff" /></div>
                <h4 className="about-feature-title">Our Vision</h4>
              </div>
              <p className="about-feature-text">To build a world where poverty and lack of resources no longer limit a human's potential, creating self-sustained communities through collective empathy.</p>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="about-values">
          <h3 className="about-values-title">The Values We Live By</h3>
          <div className="about-values-rule" />

          <div className="row text-center g-4 about-values-row">
            <div className="col-md-4">
              <div className="value-card">
                <Award size={40} className="value-icon" />
                <h5 className="value-title">Transparency</h5>
                <p className="value-text">Real-time tracking of every donation and impact metric.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="value-card">
                <Heart size={40} className="value-icon" />
                <h5 className="value-title">Integrity</h5>
                <p className="value-text">Ethics above all. We verify every cause before it goes live.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="value-card">
                <Zap size={40} className="value-icon" />
                <h5 className="value-title">Dedication</h5>
                <p className="value-text">Our volunteers work 24/7 to ensure aid reaches on time.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About