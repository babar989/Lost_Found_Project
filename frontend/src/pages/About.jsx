import { Link } from 'react-router-dom';
import useSEO from '../hooks/useSEO';
import { useLang } from '../context/LanguageContext';

export default function About() {
  const { lang } = useLang();

  useSEO(
    lang === 'ur' ? 'Hamare Mutalliq (About Us)' : 'About Us',
    'Lost & Found Portal — Khidmat-e-insaniyat aur community collaboration ke liye qaim karda digital platform jahan khoyi aur mili hui cheezein unke asal maalik tak pohnchayi jati hain.'
  );

  return (
    <article className="detail-card" style={{ maxWidth: '860px', margin: '0 auto', lineHeight: 1.8 }}>
      <header style={{ marginBottom: '28px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '20px' }}>
        <span style={{
          display: 'inline-block',
          padding: '4px 12px',
          borderRadius: '99px',
          background: 'rgba(37, 99, 235, 0.1)',
          color: 'var(--brand-blue)',
          fontSize: '0.82rem',
          fontWeight: 700,
          marginBottom: '10px'
        }}>
          🤝 Khidmat-e-Insaniyat Initiative
        </span>
        <h1 style={{ fontSize: '2.4rem', margin: '6px 0 10px', color: 'var(--text-main)' }}>
          {lang === 'ur' ? 'Hamara Maqsad & Pehchan' : 'Our Mission & Identity'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', margin: 0 }}>
          {lang === 'ur'
            ? 'Khidmat-e-khalq aur amanaat ki hifazat ke jazbe se banaya gaya community portal.'
            : 'A humanitarian community initiative dedicated to reuniting lost belongings with their rightful owners.'}
        </p>
      </header>

      <section style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
          {lang === 'ur' ? '1. Yeh Platform Kyun Banaya Gaya?' : '1. Why This Platform Exists'}
        </h2>
        <p>
          {lang === 'ur'
            ? 'Rozana hamare shehron mein beshumar shehri apni qeemti cheezein—jaise ke CNIC, driving license, educational degrees, cell phones, batwe aur chabiyan—bazaaron, metro stations, masajid aur public transport mein bhool jatay hain ya kho detay hain. Doosri taraf, bohot se naik-dil aur shareef shehri un cheezon ko paatay hain magar un ke paas asal maalik tak pohnchne ka koi mutasir tareeqa nahi hota.'
            : 'Every day in our cities, countless citizens lose essential belongings such as national identity cards, academic degrees, mobile phones, wallets, and keys. Simultaneously, honest citizens find these items but lack a safe, centralized channel to locate and contact the rightful owner.'}
        </p>
        <p>
          {lang === 'ur'
            ? 'Lost & Found ka maqsad technology ke zariye is faaslay ko khatam karna hai. Yeh platform kisi tijarti faaidey ke liye nahi balkay mukammal tor par insaniyat aur shehri bhai-charay ki bunyaad par qaim kiya gaya hai.'
            : 'Our platform bridges this gap through reliable community technology. Founded purely on humanitarian principles and community responsibility, this portal exists to serve citizens with integrity.'}
        </p>
      </section>

      <section style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
          {lang === 'ur' ? '2. Hamare Usool (Core Principles)' : '2. Our Core Principles'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '14px' }}>
          <div style={{ background: 'var(--bg-muted)', padding: '18px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>🛡️</div>
            <h3 style={{ fontSize: '1.1rem', margin: '0 0 6px' }}>Amanatdari &amp; Verification</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Har cheez ki wapsi se pehle asal malkiat (CNIC match, model number, serial) ki tauseeq lazmi hai taake cheez sahi hath mein jaye.
            </p>
          </div>

          <div style={{ background: 'var(--bg-muted)', padding: '18px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>🔒</div>
            <h3 style={{ fontSize: '1.1rem', margin: '0 0 6px' }}>Privacy &amp; Data Security</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Shehriyon ke phone numbers aur personal maloomat ko mehfooz rakha jata hai aur kisi commercial maqsad ke liye istemal nahi kiya jata.
            </p>
          </div>

          <div style={{ background: 'var(--bg-muted)', padding: '18px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>🤝</div>
            <h3 style={{ fontSize: '1.1rem', margin: '0 0 6px' }}>Community Support</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Hum shehri volunteers aur qareebi community desks ke sath mil kar cases ko resolve karne mein madad faraham karte hain.
            </p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
          {lang === 'ur' ? '3. Safe Handover (Mehfooz Wapsi) Ki Hidayat' : '3. Safe Handover Protocol'}
        </h2>
        <ul style={{ paddingLeft: '20px', margin: 0 }}>
          <li>Hamesha din ke waqt kisi roshan aur aam public jagah (jaise Metro station security counter, mall help desk ya qareebi police khidmat markaz) par mulaqaat karein.</li>
          <li>Khatoon ya akele shakhs ke case mein kisi dost ya azeez ko sath le kar jayein.</li>
          <li>Cheez hawalay karne se pehle zaroori shawahid (jaise serial number, identification mark, ya purani tasweer) lazmi check karein.</li>
        </ul>
      </section>

      <div style={{
        background: 'var(--bg-muted)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '24px',
        textAlign: 'center',
        marginTop: '32px'
      }}>
        <h3 style={{ margin: '0 0 8px' }}>
          {lang === 'ur' ? 'Kya aapko kisi cheez ki report karni hai ya rabta karna hai?' : 'Need to report an item or reach our community desk?'}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '0 0 16px' }}>
          Hamari team aur volunteers aapki madad ke liye har waqt tayyar hain.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/post" className="btn-primary">
            + Cheez Report Karein
          </Link>
          <Link to="/contact" className="btn-outline">
            Contact Support Desk
          </Link>
        </div>
      </div>
    </article>
  );
}
