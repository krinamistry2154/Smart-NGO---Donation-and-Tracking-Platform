import React, { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import CauseCard from '../../components/CauseCard'
import ngoHand from '../../assets/ngo-hand-left.svg'
import ngoHeart from '../../assets/ngo-heart-right.svg'

function Causes() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

  const causes = [
    {
      id: 1,
      title: "Food for Children",
      description: "Help provide nutritious meals to underprivileged children.",
      goal: 50000,
      raised: 22000,
      image: "https://kishor-23.github.io/food-donate/img/p1.jpeg",
      category: "food"
    },
    {
      id: 2,
      title: "Education Support",
      description: "Support books, fees and education materials for students.",
      goal: 100000,
      raised: 45000,
      image: "https://64.media.tumblr.com/727835f05d0c1ec86281d22c9c11803e/tumblr_p613j8lTeK1wti3xao1_1280.jpg",
      category: "education"
    },
    {
      id: 3,
      title: "Medical Help",
      description: "Support healthcare and emergency treatment for families.",
      goal: 150000,
      raised: 65000,
      image: "https://i.pinimg.com/736x/35/e7/c3/35e7c3c70c3e5e7b3cf272b3ff898f14.jpg",
      category: "health"
    },
    {
      id: 4,
      title: "Women Empowerment",
      description: "Provide training and support to women for self-employment.",
      goal: 80000,
      raised: 30000,
      image: "https://friendship.ngo/wp-content/uploads/2022/03/Empowered_Women1.png",
      category: "women"
    },
    {
      id: 5,
      title: "Old Age Support",
      description: "Support elderly people with essentials and care services.",
      goal: 60000,
      raised: 25000,
      image: "https://www.sassysisterstuff.com/wp-content/uploads/2023/03/Quotes-About-Caring-for-Elderly-Parents-11.jpg",
      category: "elderly"
    },
    {
      id: 6,
      title: "Disaster Relief",
      description: "Emergency support for families affected by natural disasters.",
      goal: 200000,
      raised: 125000,
      image: "https://img.freepik.com/premium-photo/national-disaster-response-force-ndrf-raising-day_968519-56522.jpg",
      category: "relief"
    }
  ]

  const filteredCauses = causes.filter(cause => {
    const matchSearch = cause.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cause.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchFilter = filter === 'all' || cause.category === filter
    return matchSearch && matchFilter
  })

  return (
    <div style={{ paddingTop: '40px', paddingBottom: '40px', background: 'transparent' }}>
      <div className="container">
        {/* Header with decorative images */}
        <div style={{ position: 'relative', marginBottom: '50px' }}>
          <img src={ngoHand} alt="" style={{ position: 'absolute', left: '-80px', top: '0', opacity: 0.15, height: '200px', zIndex: 1 }} />
          <div className="text-center mb-5 animate-fade-in" style={{ marginBottom: '50px', position: 'relative', zIndex: 2 }}>
          <h2 className="fw-bold" style={{ fontSize: '2.8rem', color: 'var(--primary-white)', marginBottom: '12px', letterSpacing: '-1px' }}>Our Causes</h2>
          <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>Support causes that matter and create lasting change in communities.</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="row g-3 mb-5 animate-slide-up">
          <div className="col-md-6">
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}>
              <Search size={20} style={{
                position: 'absolute',
                left: '16px',
                color: 'var(--primary)',
                pointerEvents: 'none',
              }} />
              <input
                type="text"
                placeholder="Search causes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '44px',
                  paddingRight: '16px',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  border: '2px solid var(--primary)',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  background: 'var(--surface)',
                  fontFamily: 'var(--sans)',
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = '0 0 0 4px rgba(79,140,255,0.10)';
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
            }}>
              {['all', 'food', 'education', 'health', 'women', 'elderly', 'relief'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: filter === cat ? 'var(--primary)' : 'rgba(79, 140, 255, 0.06)',
                    color: filter === cat ? '#fff' : 'var(--text)',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease',
                    textTransform: 'capitalize',
                  }}
                    onMouseEnter={(e) => {
                    if (filter !== cat) {
                      e.target.style.background = 'rgba(79,140,255,0.12)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (filter !== cat) {
                      e.target.style.background = 'rgba(79,140,255,0.06)';
                    }
                  }}
                >
                  {cat === 'all' ? 'All Causes' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>
        <img src={ngoHeart} alt="" style={{ position: 'absolute', right: '-80px', bottom: '-100px', opacity: 0.15, height: '200px', zIndex: 1 }} />
        </div>

        {/* Causes Grid */}
        <div className="row g-4">
          {filteredCauses.map((cause, idx) => (
            <div className="col-lg-4 col-md-6 d-flex" key={cause.id} style={{ animation: `slideUp 0.6s ease-out ${idx * 0.08}s backwards` }}>
              <div style={{ background: 'var(--surface)', width: '100%' }}>
                <CauseCard cause={cause} />
              </div>
            </div>
          ))}
        </div>

        {filteredCauses.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#666',
          }}>
            <h4 style={{ fontSize: '1.5rem', marginBottom: '12px', color: '#1a237e' }}>No causes found</h4>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Causes