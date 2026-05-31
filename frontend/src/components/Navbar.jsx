import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import logo from '../images/logo.png';

function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const location = useLocation();
  if (location.pathname && location.pathname.startsWith('/admin')) return null;

  const activeStyle = ({ isActive }) => ({
    color: isActive ? 'var(--primary)' : 'rgba(255, 255, 255, 0.9)',
    borderBottom: isActive ? '3px solid var(--primary)' : '3px solid transparent',
    transition: 'all 0.3s cubic-bezier(.4,0,.2,1)'
  });

  const getStoredUser = () => {
    const raw = localStorage.getItem('user') || sessionStorage.getItem('user')
    if (!raw) return null
    try { return JSON.parse(raw) } catch { return null }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    window.location.href = '/login'
  }

  const user = getStoredUser()
  const userRole = user?.role || user?.Role || (user?.user && (user.user.role || user.user.Role))

  return (
    <nav className="navbar navbar-expand-xl navbar-dark w-100 py-2" style={{
      background: '#000',
      height: 'var(--navbar-height)',
      display: 'flex',
      alignItems: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      boxShadow: isScrolled ? '0 6px 30px rgba(0,0,0,0.6)' : '0 2px 8px rgba(0,0,0,0.15)',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      transition: 'box-shadow 0.32s cubic-bezier(.4,0,.2,1)'
    }}>
      <div className="container-fluid px-lg-5">
        {/* Brand/Logo - Increased height and refined scaling */}
        <Link className="navbar-brand d-flex align-items-center" to="/home">
          <img 
            src={logo} 
            alt="AAROHAN Logo" 
            style={{ 
              height: '50px',  // Increased height
              width: 'auto', 
              transition: 'transform 0.3s ease' 
            }} 
            className="logo-img"
          />
        </Link>

        {/* Mobile Toggle */}
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item px-2">
              <NavLink className="nav-link fw-semibold" style={activeStyle} to="/home">Home</NavLink>
            </li>
            <li className="nav-item px-2">
              <NavLink className="nav-link fw-semibold" style={activeStyle} to="/about">About</NavLink>
            </li>
            <li className="nav-item px-2">
              <NavLink className="nav-link fw-semibold" style={activeStyle} to="/causes">Causes</NavLink>
            </li>
            <li className="nav-item px-2">
              <NavLink className="nav-link fw-semibold" style={activeStyle} to="/financial-analyzer">Finance</NavLink>
            </li>
            <li className="nav-item px-2">
              <NavLink className="nav-link fw-semibold" style={activeStyle} to="/donate">Donate</NavLink>
            </li>
            <li className="nav-item px-2">
              <NavLink className="nav-link fw-semibold" style={activeStyle} to="/volunteers">Volunteers</NavLink>
            </li>
            <li className="nav-item px-2">
              <NavLink className="nav-link fw-semibold" style={activeStyle} to="/contact">Contact</NavLink>
            </li>
            {userRole === 'Admin' && (
              <li className="nav-item px-2">
                <NavLink className="nav-link fw-semibold" style={activeStyle} to="/admin">Admin</NavLink>
              </li>
            )}

            {!user && (
              <>
                <li className="nav-item px-2">
                  <NavLink className="nav-link fw-semibold" style={activeStyle} to="/login">Login</NavLink>
                </li>
                <li className="nav-item px-2">
                  <NavLink className="nav-link fw-semibold" style={activeStyle} to="/register">Register</NavLink>
                </li>
              </>
            )}

            {user && (
              <>
                <li className="nav-item px-2">
                  <NavLink className="nav-link fw-semibold" style={activeStyle} to="/my-donations">My Donations</NavLink>
                </li>
                <li className="nav-item px-2">
                  <span className="nav-link" style={{ cursor: 'pointer' }} onClick={handleLogout}>Logout</span>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;