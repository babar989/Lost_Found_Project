import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLang } from '../context/LanguageContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { errMsg } from '../api';

export default function Register() {
  const { register } = useAuth();
  const { lang } = useLang();
  const { showToast } = useToast();
  const nav = useNavigate();

  const [f, setF] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await register(f.name, f.email, f.password, f.phone);
      showToast(
        lang === 'ur'
          ? `Mubarak, ${data.user.name}! Aapka account ban gaya.`
          : `Welcome, ${data.user.name}! Your account is ready.`,
        'success'
      );
      nav('/');
    } catch (err) {
      setError(errMsg(err));
      showToast(errMsg(err), 'error');
    }
    setBusy(false);
  };

  return (
    <div style={{ maxWidth: '460px', margin: '30px auto' }}>
      <form className="form-card" onSubmit={submit}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '6px' }}>📝</div>
          <h2 className="form-title">
            {lang === 'ur' ? 'Account Banayein' : 'Create Account'}
          </h2>
          <p className="form-subtitle">
            {lang === 'ur'
              ? 'Lost & Found community ka hissa banein'
              : 'Join the community to report and claim lost belongings'}
          </p>
        </div>

        {error && <p className="error" style={{ marginBottom: '18px' }}>{error}</p>}

        <div className="form-field">
          <label className="form-label">{lang === 'ur' ? 'Aapka Naam' : 'Full Name'} *</label>
          <input
            required
            className="form-input"
            placeholder="Ahmed Khan"
            value={f.name}
            onChange={(e) => setF({ ...f, name: e.target.value })}
          />
        </div>

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
          <label className="form-label">{lang === 'ur' ? 'Mobile / WhatsApp Number' : 'Phone / WhatsApp Number'}</label>
          <input
            type="tel"
            className="form-input"
            placeholder="0300 1234567"
            value={f.phone}
            onChange={(e) => setF({ ...f, phone: e.target.value })}
          />
        </div>

        <div className="form-field">
          <label className="form-label">{lang === 'ur' ? 'Password (kam az kam 6 harf)' : 'Password (min 6 characters)'} *</label>
          <input
            type="password"
            minLength={6}
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
          {busy
            ? (lang === 'ur' ? 'Account ban raha hai...' : 'Creating account...')
            : (lang === 'ur' ? '✓ Account Banayein' : '✓ Create Account')}
        </button>

        <p style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {lang === 'ur' ? 'Pehle se account hai?' : 'Already have an account?'}{' '}
          <Link to="/login" style={{ color: 'var(--brand-blue)', fontWeight: 700 }}>
            {lang === 'ur' ? 'Login karein' : 'Sign In'}
          </Link>
        </p>
      </form>
    </div>
  );
}
