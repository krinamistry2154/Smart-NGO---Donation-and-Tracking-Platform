import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, TrendingUp, AlertCircle, Users } from 'lucide-react'

function CauseCard({ cause }) {
  const progress = Math.min((cause.raised / cause.goal) * 100, 100)
  const isUrgent = progress < 40
  const getCategoryColor = (category) => {
    const colors = {
      food: '#FF6B6B',
      education: '#4ECDC4',
      health: '#FF6B9D',
      women: '#FFD93D',
      elderly: '#6BCB77',
      relief: '#FF8C42'
    }
    return colors[category] || '#4F8CFF'
  }

  return (
    <div className="card-modern h-100" style={{
      borderRadius: '20px',
      overflow: 'hidden',
      transition: 'all 0.4s cubic-bezier(.4,0,.2,1)',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 8px 32px rgba(79,140,255,0.12)',
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-12px) scale(1.025)';
        e.currentTarget.style.boxShadow = '0 20px 60px rgba(79,140,255,0.28)';
        e.currentTarget.style.borderColor = 'var(--primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(79,140,255,0.12)';
        e.currentTarget.style.borderColor = '#e3e8ee';
      }}
    >
      <div style={{ position: 'relative', overflow: 'hidden', height: '240px' }}>
        <img 
          src={cause.image} 
          alt={cause.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s cubic-bezier(.4,0,.2,1)',
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.12)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        />
        {/* Dark overlay gradient */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none',
        }}></div>
        {/* Category Badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: getCategoryColor(cause.category),
          color: '#fff',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: '700',
          textTransform: 'capitalize',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}>
          {cause.category}
        </div>
        {/* Heart Icon Badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(79,140,255,0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '50%',
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: '0 4px 16px rgba(79,140,255,0.4)',
        }}>
          <Heart size={22} fill="currentColor" />
        </div>
        {/* Urgency Indicator */}
        {isUrgent && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 107, 107, 0.95)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: '700',
            boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
          }}>
            <AlertCircle size={14} />
            URGENT
          </div>
        )}
      </div>

      <div style={{
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
      }}>
        <h5 style={{
          fontSize: '1.4rem',
          fontWeight: '800',
          marginBottom: '10px',
          color: 'var(--text)',
          letterSpacing: '-0.6px',
          lineHeight: '1.3',
        }}>{cause.title}</h5>
        
        <p style={{
          fontSize: '0.95rem',
          color: 'rgba(255,255,255,0.75)',
          marginBottom: '20px',
          flex: 1,
          lineHeight: '1.6',
        }}>{cause.description}</p>

        {/* Progress Section */}
        <div style={{
          marginBottom: '24px',
          padding: '16px',
          background: 'rgba(79,140,255,0.04)',
          borderRadius: '14px',
          border: '1px solid rgba(79,140,255,0.1)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#999' }}>Progress</span>
            <span style={{
              fontSize: '0.9rem',
              fontWeight: '800',
              background: `linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {progress.toFixed(0)}%
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '10px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #4F8CFF 0%, #FF6B9D 100%)',
              borderRadius: '12px',
              transition: 'width 0.6s cubic-bezier(.4,0,.2,1)',
              boxShadow: '0 0 12px rgba(79,140,255,0.4)',
            }}></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '14px',
          marginBottom: '24px',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(79,140,255,0.1) 0%, rgba(79,140,255,0.05) 100%)',
            borderRadius: '14px',
            padding: '14px',
            textAlign: 'center',
            border: '1px solid rgba(79,140,255,0.15)',
          }}>
            <p style={{ fontSize: '0.8rem', color: '#999', margin: '0 0 6px 0', fontWeight: '600' }}>Goal</p>
            <p style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)', margin: 0 }}>₹{(cause.goal / 1000).toFixed(0)}k</p>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
            borderRadius: '14px',
            padding: '14px',
            textAlign: 'center',
            border: '1px solid rgba(16, 185, 129, 0.15)',
          }}>
            <p style={{ fontSize: '0.8rem', color: '#999', margin: '0 0 6px 0', fontWeight: '600' }}>Raised</p>
            <p style={{ fontSize: '1.2rem', fontWeight: '800', color: '#10B981', margin: 0 }}>₹{(cause.raised / 1000).toFixed(0)}k</p>
          </div>
        </div>

        {/* Remaining Amount */}
        <div style={{
          textAlign: 'center',
          marginBottom: '24px',
          padding: '12px',
          background: 'rgba(79,140,255,0.08)',
          borderRadius: '12px',
        }}>
          <p style={{ 
            fontSize: '0.85rem', 
            color: '#999', 
            margin: '0 0 4px 0',
            fontWeight: '600'
          }}>More Needed</p>
          <p style={{ 
            fontSize: '1.3rem', 
            fontWeight: '800', 
            color: 'var(--primary)',
            margin: 0
          }}>₹{((cause.goal - cause.raised) / 1000).toFixed(0)}k</p>
        </div>

          <Link 
          to={`/donate/${cause.id}`} 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '14px 24px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '1.05rem',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
            border: 'none',
            boxShadow: '0 8px 20px rgba(79,140,255,0.3)',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 12px 32px rgba(79,140,255,0.48)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 8px 20px rgba(79,140,255,0.3)';
          }}
        >
          <Heart size={18} />
          Donate Now
        </Link>
      </div>
    </div>
  )
}

export default CauseCard