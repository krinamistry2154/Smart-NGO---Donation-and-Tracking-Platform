import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import illustration from '../../assets/login-illustration.svg'
import bg from '../../assets/login-bg.svg'
import aarohanLogo from '../../images/logo.png'
import './login.css'

function Login() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  useEffect(() => {
    // Ensure inputs are blank when the page loads (defensive against autofill)
    setLoginData({ email: "", password: "" });
  }, []);

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!loginData.email || !loginData.password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/Auth/login", loginData);
      const data = response.data;
      console.log('Login response:', response);

      localStorage.setItem("token", data.token);

      if (remember) {
        localStorage.setItem("user", JSON.stringify(data));
      } else {
        sessionStorage.setItem("user", JSON.stringify(data));
      }

      const role = data.role;
      if (role === "Admin") navigate("/admin");
      else navigate("/home");

    } catch (err) {
      console.error('Login error:', err);
      
      const msg = err.response?.data?.message || err.response?.data || err.message || "Login failed. Check credentials.";
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" style={{ backgroundImage: `url(${bg})` }}>
      <div className="login-wrapper">

        <div className="left-illustration">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img src={aarohanLogo} alt="Aarohan" style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'contain', background: 'rgba(255,255,255,0.04)', padding: 8, boxShadow: '0 12px 30px rgba(2,6,23,0.5)' }} />
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Welcome back</h2>
              <p style={{ margin: 0, opacity: 0.95 }}>Sign in to continue supporting causes</p>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={illustration} alt="Illustration" className="login-illustration" />
          </div>

          <div style={{ fontSize: 13, opacity: 0.95 }}>
            <strong>Why join?</strong>
            <ul style={{ paddingLeft: 18, marginTop: 8 }}>
              <li>Track donations and impact</li>
              <li>Connect with volunteers</li>
              <li>Manage causes securely</li>
            </ul>
          </div>
        </div>

        <div className="right-form">
          <div style={{ maxWidth: 360, margin: '0 auto', width: '100%', animation: 'fadeInUp .5s ease' }}>
            <h3 style={{ marginBottom: 6, color: '#fff' }}>Sign in</h3>
            <p style={{ marginTop: 0, marginBottom: 18, color: 'rgba(255,255,255,0.75)' }}>Continue to manage your account and donations.</p>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            {/* debug output removed to avoid flashing JSON during auth */}

           

            <form onSubmit={handleSubmit} autoComplete="off">
              {/* Hidden fields to discourage browser autofill */}
              <input type="text" name="fakeusernameremembered" style={{ display: 'none' }} autoComplete="username" />
              <input type="password" name="fakepasswordremembered" style={{ display: 'none' }} autoComplete="new-password" />
              <div className="form-field">
                <input
                  name="email"
                  value={loginData.email}
                  onChange={handleChange}
                  type="email"
                  className="form-control"
                  placeholder=" "
                  autoComplete="off"
                  required
                />
                <label className="floating">Email</label>
              </div>

              <div className="form-field">
                <input
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder=" "
                  autoComplete="off"
                  required
                />
                <label className="floating">Password</label>
                <button
                  type="button"
                  className="password-toggle"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3l18 18" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M17.94 17.94A10.94 10.94 0 0112 19c-7 0-11-7-11-7a18.64 18.64 0 013.59-4.48" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" stroke="#fff" strokeWidth="1.4"/></svg>
                  )}
                </button>
              </div>

              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={remember}
                    onChange={() => setRemember(!remember)}
                    id="remember"
                  />
                  <label className="form-check-label" htmlFor="remember" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    Remember me
                  </label>
                </div>


              </div>

              <button
                className="submit-btn btn btn-primary w-100 btn-lg"
                type="submit"
                disabled={loading}
                style={{ background: 'linear-gradient(90deg,#6b46c1,#2563eb)', border: 'none' }}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="text-center mt-3">
              <small style={{ color: 'rgba(255,255,255,0.75)' }}>
                Don’t have an account? <Link to="/register" style={{ color: '#c7b8ff' }}>Create one</Link>
              </small>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;