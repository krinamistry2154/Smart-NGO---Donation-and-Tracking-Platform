import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import './footer.css'
import logo from '../images/logo.png'

function Footer() {
  const location = useLocation();
  if (location.pathname && location.pathname.startsWith('/admin')) return null;
  return (
    <footer className="nds-footer">
      <div className="nds-brand-outer">
        <img src={logo} alt="Aarohan" className="nds-logo" />
            <div>
          <h3 className="nds-title">NGO Donation System</h3>
          <p className="nds-sub">Empowering communities through transparent, accountable giving. We connect donors with verified causes, ensure funds reach those in need, and measure impact to create lasting change.</p>
        </div>
      </div>
      <div className="nds-container">
        <div className="nds-grid">

          <div className="nds-links">
            <h4>Explore</h4>
            <ul>
              <li>
                <Link to="/home">
                  <span className="nds-link-icon" aria-hidden>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 11L12 4l9 7v7a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about">
                  <span className="nds-link-icon" aria-hidden>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2"/><path d="M11 11h2v4h-2zM11 7h2v2h-2z" fill="currentColor"/></svg>
                  </span>
                  About
                </Link>
              </li>
              <li>
                <Link to="/causes">
                  <span className="nds-link-icon" aria-hidden>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21s-6-4.35-9-7.2C1.8 11.5 3.6 6 8 5c2.2-.5 4 1.2 4 1.2s1.8-1.7 4-1.2c4.4 1 6.2 6.5 5 8.8C18 16.65 12 21 12 21z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  Causes
                </Link>
              </li>
              <li>
                <Link to="/donate">
                  <span className="nds-link-icon" aria-hidden>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 12v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 3v13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  Donate
                </Link>
              </li>
              <li>
                <Link to="/contact">
                  <span className="nds-link-icon" aria-hidden>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="nds-news">
            <h4>Join Our Newsletter</h4>
            <form className="nds-form" onSubmit={e => e.preventDefault()}>
              <div className="nds-input-wrap">
                <svg className="nds-mail-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M3 8.5L12 13l9-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <input type="email" placeholder="Enter your email" aria-label="Email" required />
              </div>
              <button className="nds-cta" type="submit">Subscribe</button>
            </form>

            <div className="nds-socials" aria-hidden>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="s"><i className="fab fa-facebook-f"></i></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="s"><i className="fab fa-twitter"></i></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="s"><i className="fab fa-instagram"></i></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="s"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
        </div>

        <div className="nds-bottom">
          <p>© 2026 NGO Donation System. All Rights Reserved.</p>
          <div className="nds-credits">Built with ❤️ · <Link to="/privacy">Privacy</Link></div>
        </div>
      </div>
    </footer>
  )
}

export default Footer