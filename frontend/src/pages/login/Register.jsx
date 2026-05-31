import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import illustration from '../../assets/login-illustration.svg'
import bg from '../../assets/login-bg.svg'
import aarohanLogo from '../../images/logo.png'
import './login.css'

function passwordStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (/[A-Z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  return score;
}

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const strength = passwordStrength(formData.password);
    if (strength < 3) {
      setError("Password is too weak. Use at least 8 characters with numbers and symbols.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/Auth/register", {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
      alert(response.data.message || "Registration successful!");
      navigate("/login");
    } catch (err) {
      console.error("Registration Error:", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const strength = passwordStrength(formData.password);

  return (
    <div className="login-page" style={{ backgroundImage: `url(${bg})` }}>
      <div className="login-wrapper">

        <div className="left-illustration">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img src={aarohanLogo} alt="Aarohan" style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'contain', background: 'rgba(255,255,255,0.04)', padding: 8, boxShadow: '0 12px 30px rgba(2,6,23,0.5)' }} />
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Join Aarohan</h2>
              <p style={{ margin: 0, opacity: 0.95 }}>Create an account to start contributing.</p>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={illustration} alt="Illustration" className="login-illustration" />
          </div>

          <div style={{ fontSize: 13, opacity: 0.95 }}>
            <strong>Benefits</strong>
            <ul style={{ paddingLeft: 18, marginTop: 8 }}>
              <li>Track donations and impact</li>
              <li>Connect with volunteers</li>
              <li>Manage causes securely</li>
            </ul>
          </div>
        </div>

        <div className="right-form">
          <div style={{ maxWidth: 360, margin: '0 auto', width: '100%', animation: 'fadeInUp .5s ease' }}>
            <h3 style={{ marginBottom: 6, color: '#fff' }}>Create account</h3>
            <p style={{ marginTop: 0, marginBottom: 18, color: 'rgba(255,255,255,0.75)' }}>Join Aarohan to manage causes and donate.</p>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="form-field">
                <input name="fullName" value={formData.fullName} onChange={handleChange} className="form-control" placeholder=" " autoComplete="off" required />
                <label className="floating">Full name</label>
              </div>

              <div className="form-field">
                <input name="email" value={formData.email} onChange={handleChange} type="email" className="form-control" placeholder=" " autoComplete="off" required />
                <label className="floating">Email</label>
              </div>

              <div className="form-field">
                <input name="password" value={formData.password} onChange={handleChange} type={showPassword ? 'text' : 'password'} className="form-control" placeholder=" " autoComplete="new-password" required />
                <label className="floating">Password</label>
                <button type="button" className="password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3l18 18" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M17.94 17.94A10.94 10.94 0 0112 19c-7 0-11-7-11-7a18.64 18.64 0 013.59-4.48" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" stroke="#fff" strokeWidth="1.4"/></svg>
                  )}
                </button>
              </div>

              <div className="form-field">
                <input name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type={showConfirm ? 'text' : 'password'} className="form-control" placeholder=" " autoComplete="new-password" required />
                <label className="floating">Confirm password</label>
                <button type="button" className="password-toggle" aria-label={showConfirm ? 'Hide password' : 'Show password'} aria-pressed={showConfirm} onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3l18 18" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M17.94 17.94A10.94 10.94 0 0112 19c-7 0-11-7-11-7a18.64 18.64 0 013.59-4.48" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" stroke="#fff" strokeWidth="1.4"/></svg>
                  )}
                </button>
              </div> 

              <div style={{ marginBottom: 12 }}>
                <div style={{ height: 8, borderRadius: 6, background: 'rgba(255,255,255,0.03)', overflow: 'hidden' }}>
                  <div style={{ width: `${(strength / 4) * 100}%`, height: '100%', background: strength >= 3 ? '#22c55e' : '#fb923c', transition: 'width 200ms' }} />
                </div>
                <small className="muted-small">Use at least 8 characters including numbers and symbols.</small>
              </div>

              <div className="form-check mb-3">
                <input className="form-check-input" type="checkbox" id="terms" required />
                <label className="form-check-label" htmlFor="terms">I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.</label>
              </div>

              <button className="submit-btn btn btn-primary w-100 btn-lg" type="submit" disabled={loading} style={{ background: 'linear-gradient(90deg,#6b46c1,#2563eb)', border: 'none' }}>{loading ? 'Creating...' : 'Create account'}</button>
            </form>

            <div className="text-center mt-3">
              <small style={{ color: 'rgba(255,255,255,0.75)' }}>Already have an account? <Link to="/login" style={{ color: '#c7b8ff' }}>Sign in</Link></small>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;