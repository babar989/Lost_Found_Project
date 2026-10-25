import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLang } from '../context/LanguageContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { errMsg } from '../api';

export default function Login() {
  const { login } = useAuth();
  const { lang } = useLang();
  const { showToast } = useToast();
  const nav = useNavigate();
  const location = useLocation();

  const [f, setF] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const fillDemo = (email, password) => {
    setF({ email, password });
    setError('');
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await login(f.email, f.password);
      showToast(
        lang === 'ur'
          ? `Khush Amdeed, ${data.user.name}!`
          : `Welcome back, ${data.user.name}!`,
        'success'
      );
      nav(from, { replace: true });
    } catch (err) {
      setError(errMsg(err));
      showToast(errMsg(err), 'error');
    }
    setBusy(false);
  };

  return (
    <div style={{ maxWidth: '440px', margin: '30px auto' }}>
      <form className="form-card" onSubmit={submit}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '6px' }}>🔐</div>
          <h2 className="form-title">{lang === 'ur' ? 'Login Karein' : 'Account Login'}</h2>
          <p className="form-subtitle">
            {lang === 'ur'
              ? 'Apne account mein dakhil hon'
              : 'Sign in to report and manage your items'}
          </p>
        </div>

        {error && <p className="error" style={{ marginBottom: '18px' }}>{error}</p>}

        <div className="form-field">
          <label className="form-label">{lang === 'ur' ? 'Email Address' : 'Email Address'} *</label>
          <input
            type="email"
            required
            className="form-input"
            placeholder="name@example.com"
            value={f.email}
            onChange={(e) => setF({ ...f, email: e.target.value })}
          />
        </div>

        <div className="form-field">
          <label className="form-label">{lang === 'ur' ? 'Password' : 'Password'} *</label>
          <input
            type="password"
            required
            className="form-input"
            placeholder="••••••••"
            value={f.password}
            onChange={(e) => setF({ ...f, password: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="btn-primary"
          style={{ width: '100%', marginTop: '14px', padding: '12px' }}
          disabled={busy}
        >
          {busy ? (lang === 'ur' ? 'Ruk jayein...' : 'Logging in...') : (lang === 'ur' ? 'Login Karein' : 'Sign In')}
        </button>

        <p style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {lang === 'ur' ? 'Account nahi hai?' : "Don't have an account?"}{' '}
          <Link to="/register" style={{ color: 'var(--brand-blue)', fontWeight: 700 }}>
            {lang === 'ur' ? 'Naya account banayein' : 'Create an Account'}
          </Link>
        </p>

        {/* Demo Test Accounts */}
        <div className="demo-accounts-card">
          <div style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
            ⚡ {lang === 'ur' ? 'Demo Test Accounts (Click Karein):' : 'Demo Test Accounts (1-Click Fill):'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <button
              type="button"
              className="demo-btn-pill"
              onClick={() => fillDemo('ahmed@lostfound.pk', 'password123')}
            >
              👤 Ahmed Khan
            </button>
            <button
              type="button"
              className="demo-btn-pill"
              onClick={() => fillDemo('fatima@lostfound.pk', 'password123')}
            >
              👤 Fatima Noor
            </button>
            <button
              type="button"
              className="demo-btn-pill"
              onClick={() => fillDemo('hamza@lostfound.pk', 'password123')}
            >
              👤 Hamza Ali
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
