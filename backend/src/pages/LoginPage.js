import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/slices/authSlice';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { BrandLogo } from '../components/common/BrandLogo';
import './AuthPage.css';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated } = useSelector(s => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => { if (isAuthenticated) navigate('/'); }, [isAuthenticated, navigate]);

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(login(form));
  };

  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-brand">
          <BrandLogo size="lg" />
        </div>
        <div className="auth-left-text">
          <h2>Welcome Back!</h2>
          <p>Login to access thousands of premium electronics available to rent or buy at the best prices.</p>
        </div>
        <div className="auth-features">
          <div className="auth-feature"><span>🏷️</span> Rent from ₹399/month</div>
          <div className="auth-feature"><span>🛒</span> Buy at best prices</div>
          <div className="auth-feature"><span>🚚</span> Free delivery &amp; setup</div>
          <div className="auth-feature"><span>🔒</span> Secure Razorpay payments</div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-card">
          <h2>Login 👋</h2>
          <p className="auth-subtitle">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-icon-wrap">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  className="form-control with-icon"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-wrap">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control with-icon"
                  placeholder="Your password"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  required
                />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(v => !v)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              style={{ marginTop: 4 }}
              disabled={loading}
            >
              {loading ? <><span className="btn-spinner"></span> Logging in…</> : 'Login'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Sign Up Free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
