import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/slices/authSlice';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { BrandLogo } from '../components/common/BrandLogo';
import './AuthPage.css';

/* tiny helper — returns error string or '' */
const validate = (form) => {
  if (!form.name.trim())               return 'Full name is required';
  if (form.name.trim().length < 2)     return 'Name must be at least 2 characters';
  if (!form.email.trim())              return 'Email address is required';
  if (!/\S+@\S+\.\S+/.test(form.email)) return 'Enter a valid email address';
  if (form.phone && !/^\d{10}$/.test(form.phone.trim()))
                                       return 'Phone must be exactly 10 digits';
  if (!form.password)                  return 'Password is required';
  if (form.password.length < 6)        return 'Password must be at least 6 characters';
  if (!/[A-Z]/.test(form.password))    return 'Password must contain at least one uppercase letter';
  if (!/[0-9]/.test(form.password))    return 'Password must contain at least one number';
  if (!form.confirmPassword)           return 'Please confirm your password';
  if (form.password !== form.confirmPassword) return 'Passwords do not match';
  return '';
};

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated } = useSelector(s => s.auth);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: ''
  });
  const [showPwd, setShowPwd]           = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [error, setError]               = useState('');
  const [touched, setTouched]           = useState({});

  useEffect(() => { if (isAuthenticated) navigate('/'); }, [isAuthenticated, navigate]);

  const set = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    setTouched(p => ({ ...p, [key]: true }));
    setError('');
  };

  const fieldError = (key) => {
    if (!touched[key]) return '';
    const partial = { ...form };
    // validate only the relevant field
    switch (key) {
      case 'name':
        if (!partial.name.trim()) return 'Full name is required';
        if (partial.name.trim().length < 2) return 'Min 2 characters';
        break;
      case 'email':
        if (!partial.email.trim()) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(partial.email)) return 'Enter a valid email';
        break;
      case 'phone':
        if (partial.phone && !/^\d{10}$/.test(partial.phone.trim())) return 'Must be 10 digits';
        break;
      case 'password':
        if (!partial.password) return 'Password is required';
        if (partial.password.length < 6) return 'Min 6 characters';
        if (!/[A-Z]/.test(partial.password)) return 'Add at least one uppercase letter';
        if (!/[0-9]/.test(partial.password)) return 'Add at least one number';
        break;
      case 'confirmPassword':
        if (!partial.confirmPassword) return 'Confirm your password';
        if (partial.password !== partial.confirmPassword) return 'Passwords do not match';
        break;
      default: break;
    }
    return '';
  };

  const handleSubmit = e => {
    e.preventDefault();
    // mark all fields touched
    setTouched({ name: true, email: true, phone: true, password: true, confirmPassword: true });
    const err = validate(form);
    if (err) { setError(err); return; }
    setError('');
    dispatch(register({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password
    }));
  };

  /* password strength indicator */
  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6)         s++;
    if (p.length >= 10)        s++;
    if (/[A-Z]/.test(p))       s++;
    if (/[0-9]/.test(p))       s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s; // 0-5
  })();
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength];
  const strengthColor = ['', '#ef4444', '#f59e0b', '#eab308', '#22c55e', '#16a34a'][strength];

  return (
    <div className="auth-page">
      {/* ── Left panel ── */}
      <div className="auth-left">
        <div className="auth-brand"><BrandLogo size="lg" /></div>
        <div className="auth-left-text">
          <h2>Join rentselectronics.com</h2>
          <p>Create a free account and start renting or buying premium electronics today.</p>
        </div>
        <div className="auth-features">
          <div className="auth-feature"><span>🎉</span> Free account, no charges</div>
          <div className="auth-feature"><span>📦</span> Track all your orders</div>
          <div className="auth-feature"><span>❤️</span> Save favourites to wishlist</div>
          <div className="auth-feature"><span>⚡</span> Faster checkout every time</div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="auth-right">
        <div className="auth-card register-card">
          <h2>Create Account 🚀</h2>
          <p className="auth-subtitle">Sign up to get started</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>

            {/* Full Name */}
            <div className="form-group">
              <input
                type="text"
                className={`form-control reg-input${fieldError('name') ? ' input-err' : touched.name && !fieldError('name') ? ' input-ok' : ''}`}
                value={form.name}
                onChange={e => set('name', e.target.value)}
                onBlur={() => setTouched(p => ({ ...p, name: true }))}
                required
              />
              <label className={`reg-label${form.name ? ' active' : ''}`}>Full Name</label>
              {fieldError('name') && <span className="field-err">{fieldError('name')}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <input
                type="email"
                className={`form-control reg-input${fieldError('email') ? ' input-err' : touched.email && !fieldError('email') ? ' input-ok' : ''}`}
                value={form.email}
                onChange={e => set('email', e.target.value)}
                onBlur={() => setTouched(p => ({ ...p, email: true }))}
                required
              />
              <label className={`reg-label${form.email ? ' active' : ''}`}>Email Address</label>
              {fieldError('email') && <span className="field-err">{fieldError('email')}</span>}
            </div>

            {/* Phone */}
            <div className="form-group">
              <input
                type="tel"
                className={`form-control reg-input${fieldError('phone') ? ' input-err' : touched.phone && form.phone && !fieldError('phone') ? ' input-ok' : ''}`}
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                onBlur={() => setTouched(p => ({ ...p, phone: true }))}
                maxLength={10}
              />
              <label className={`reg-label${form.phone ? ' active' : ''}`}>Phone Number <span style={{fontWeight:400,color:'#a0aec0'}}>(optional)</span></label>
              {fieldError('phone') && <span className="field-err">{fieldError('phone')}</span>}
            </div>

            {/* Password */}
            <div className="form-group">
              <div className="reg-pwd-wrap">
                <input
                  type={showPwd ? 'text' : 'password'}
                  className={`form-control reg-input${fieldError('password') ? ' input-err' : touched.password && !fieldError('password') ? ' input-ok' : ''}`}
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  onBlur={() => setTouched(p => ({ ...p, password: true }))}
                  required
                />
                <label className={`reg-label${form.password ? ' active' : ''}`}>Password</label>
                <button type="button" className="reg-eye" onClick={() => setShowPwd(v => !v)} tabIndex={-1}>
                  {showPwd ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {/* strength bar */}
              {form.password && (
                <div className="pwd-strength">
                  <div className="pwd-strength-bar">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="pwd-seg" style={{ background: i <= strength ? strengthColor : '#e2e8f0' }} />
                    ))}
                  </div>
                  <span style={{ color: strengthColor, fontSize: 11, fontWeight: 600 }}>{strengthLabel}</span>
                </div>
              )}
              {fieldError('password') && <span className="field-err">{fieldError('password')}</span>}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <div className="reg-pwd-wrap">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className={`form-control reg-input${fieldError('confirmPassword') ? ' input-err' : touched.confirmPassword && !fieldError('confirmPassword') ? ' input-ok' : ''}`}
                  value={form.confirmPassword}
                  onChange={e => set('confirmPassword', e.target.value)}
                  onBlur={() => setTouched(p => ({ ...p, confirmPassword: true }))}
                  required
                />
                <label className={`reg-label${form.confirmPassword ? ' active' : ''}`}>Confirm Password</label>
                <button type="button" className="reg-eye" onClick={() => setShowConfirm(v => !v)} tabIndex={-1}>
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {fieldError('confirmPassword') && <span className="field-err">{fieldError('confirmPassword')}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              style={{ padding: '11px', fontSize: 15, marginTop: 4 }}
              disabled={loading}
            >
              {loading ? <><span className="btn-spinner"></span> Creating…</> : 'Create Account'}
            </button>
          </form>

          <p className="auth-terms">
            By signing up you agree to our <a href="#!">Terms</a> &amp; <a href="#!">Privacy Policy</a>
          </p>
          <p className="auth-switch">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
