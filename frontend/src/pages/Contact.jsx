import { useState } from 'react';
import useSEO from '../hooks/useSEO';
import { useLang } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import api, { errMsg } from '../api';

export default function Contact() {
  const { lang } = useLang();
  const { showToast } = useToast();

  useSEO(
    lang === 'ur' ? 'Rabta Karein (Contact Support)' : 'Contact Us',
    'Lost & Found Community Desk — Hamare sath rabta karein, inquiry submit karein ya helpline aur WhatsApp support par live help hasil karein.'
  );

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [busy, setBusy] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await api.post('/contact', form);
      setSuccessMsg(res.data.msg);
      showToast(
        lang === 'ur' ? 'Paigham kamyabi se pohnch gaya!' : 'Message sent successfully!',
        'success'
      );
      setForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      setErrorMsg(errMsg(err));
      showToast(errMsg(err), 'error');
    }
    setBusy(false);
  };

  return (
    <div className="wrap" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span style={{
          display: 'inline-block',
          padding: '4px 12px',
          borderRadius: '99px',
          background: 'rgba(37, 99, 235, 0.1)',
          color: 'var(--brand-blue)',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '8px'
        }}>
          📞 Community Helpdesk &amp; Support
        </span>
        <h1 style={{ fontSize: '2.4rem', margin: '4px 0 10px' }}>
          {lang === 'ur' ? 'Rabta Karein (Contact Us)' : 'Get in Touch with Our Team'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
          {lang === 'ur'
            ? 'Kisi bhi qisam ki verification, technical masle ya inquiry ke liye hamari community team se rabta karein.'
            : 'Have questions, need verification assistance, or want to connect with our local community desks?'}
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(320px, 1.2fr)', gap: '32px' }}>
        {/* Left Column: Official Contact Identity */}
        <div>
          <div className="detail-card" style={{ height: '100%' }}>
            <h2 style={{ fontSize: '1.35rem', margin: '0 0 16px' }}>
              {lang === 'ur' ? 'Rasmi Maloomat (Official Details)' : 'Contact Channels'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.4rem' }}>📍</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Physical Community Desk:</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    Community Support Desk, 3rd Floor, National Incubation Center (NIC), Street 6, Sector H-9/1, Islamabad, Pakistan.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.4rem' }}>✉️</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Email Support:</div>
                  <a href="mailto:support@lostfound.pk" style={{ color: 'var(--brand-blue)', fontWeight: 600 }}>
                    support@lostfound.pk
                  </a>
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Response time: within 4–6 hours</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.4rem' }}>📞</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Official Helpline:</div>
                  <a href="tel:+92518899770" style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                    +92 (051) 8899770
                  </a>
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Mon – Sat, 9:00 AM – 7:00 PM PKT</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.4rem' }}>💬</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Live WhatsApp Support:</div>
                  <a
                    href="https://wa.me/923001234567?text=Assalam-o-Alaikum%20Lost%20Found%20Support%20Team"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-whatsapp"
                    style={{ display: 'inline-flex', marginTop: '6px', padding: '8px 14px', fontSize: '0.88rem' }}
                  >
                    💬 Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '28px', borderTop: '1px solid var(--border-subtle)', paddingTop: '18px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <strong>Note:</strong> Emergency cases mein police helpline <strong>15</strong> par ittila lazmi dein.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Working Contact Form */}
        <div>
          <form className="form-card" onSubmit={handleSubmit} style={{ margin: 0, maxWidth: '100%' }}>
            <h2 style={{ fontSize: '1.35rem', margin: '0 0 6px' }}>
              {lang === 'ur' ? 'Paigham Bhejein (Direct Form)' : 'Send a Message'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0 0 20px' }}>
              Form bhar kar bhej dein, hamari team foran review karegi.
            </p>

            {successMsg && (
              <div style={{ background: 'var(--found-green-soft)', border: '1px solid var(--found-green-border)', color: '#065f46', padding: '12px 14px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                ✅ {successMsg}
              </div>
            )}

            {errorMsg && <p className="error" style={{ marginBottom: '16px' }}>{errorMsg}</p>}

            <div className="form-row-2">
              <div className="form-field">
                <label className="form-label">{lang === 'ur' ? 'Aapka Naam' : 'Full Name'} *</label>
                <input
                  required
                  className="form-input"
                  placeholder="Ahmed Khan"
                  value={form.name}
                  onChange={handleChange('name')}
                />
              </div>

              <div className="form-field">
                <label className="form-label">{lang === 'ur' ? 'Email Address' : 'Email Address'} *</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={handleChange('email')}
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-field">
                <label className="form-label">{lang === 'ur' ? 'Phone Number' : 'Phone Number'}</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="0300 1234567"
                  value={form.phone}
                  onChange={handleChange('phone')}
                />
              </div>

              <div className="form-field">
                <label className="form-label">{lang === 'ur' ? 'Mozu (Subject)' : 'Subject'} *</label>
                <input
                  required
                  className="form-input"
                  placeholder={lang === 'ur' ? 'Jaise: Item Verification Inquiry' : 'e.g., Claim assistance'}
                  value={form.subject}
                  onChange={handleChange('subject')}
                />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">{lang === 'ur' ? 'Aapka Paigham' : 'Your Message'} *</label>
              <textarea
                required
                rows={4}
                className="form-textarea"
                placeholder={lang === 'ur' ? 'Apna sawal ya tafseel yahan likhein...' : 'Describe your inquiry or case...'}
                value={form.message}
                onChange={handleChange('message')}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: '10px' }}
              disabled={busy}
            >
              {busy
                ? (lang === 'ur' ? 'Bhej rahe hain...' : 'Sending message...')
                : (lang === 'ur' ? '✉️ Paigham Bhejein' : '✉️ Send Message')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
