import { useState } from 'react';
import useSEO from '../hooks/useSEO';
import { useLang } from '../context/LanguageContext';

const FAQ_DATA = [
  {
    category: 'General & Purpose',
    items: [
      {
        q: 'Yeh platform kis maqsad ke liye banaya gaya hai?',
        a: 'Yeh portal shehar aur mohalle ki khoyi hui ya mili hui cheezon ko unke asal malkan tak pohnchane ke liye insaniyat aur shehri khidmat ke jazbay se banaya gaya hai.',
      },
      {
        q: 'Kya post lagane ke liye account banana zaroori hai?',
        a: 'Cheezein talash karna sab ke liye khula hai. Nayi post karne ya paigham bhejne ke liye 1-minute ka muft account register karna hota hai taake report authentic rahe.',
      },
    ],
  },
  {
    category: 'Lost Items (Khoyi Hui Cheezein)',
    items: [
      {
        q: 'Meri cheez kho gayi hai, mujhe foran kya karna chahiye?',
        a: '1. Foran is portal par "Khoyi Hui Cheez" report karein. 2. Agar electronic device ya CNIC hai to qareebi police station mein roznamcha (lost report) darj karwayein. 3. Bank cards foran block karwayein.',
      },
      {
        q: 'Cheez wapas milne par post ka kya karun?',
        a: 'Jaise hi aapki cheez wapas mil jaye, apni post par ja kar "Cheez Wapas Mil Gayi (Reunited)" ka button daba dein ya post delete kar dein taake mazeed log call na karein.',
      },
    ],
  },
  {
    category: 'Found Items (Mili Hui Cheezein)',
    items: [
      {
        q: 'Mujhe public jagah se kisi ka wallet ya phone mila hai, main kya karun?',
        a: 'Cheez ki wazeh tasweer aur nishaniyan yahan "Mili Hui Cheez" ke tor par post karein. Serial number ya password jaisi khas nishaniyan chupa kar rakhein taake sirf asal maalik hi bata sakay.',
      },
      {
        q: 'Main kisi ko cheez hawalay karne se pehle kya tasdeeq karun?',
        a: 'Asal maalik se CNIC ka record match karwayein, phone ka lock screen code open karwayein, ya key ki nishani poochein. Mulaqaat hamesha din ke waqt public jagah par karein.',
      },
    ],
  },
];

export default function Faqs() {
  const { lang } = useLang();
  const [openIdx, setOpenIdx] = useState('0-0');

  useSEO(
    lang === 'ur' ? 'Aksar Poochay Gaye Sawalat (FAQs)' : 'Frequently Asked Questions',
    'Lost & Found Community Portal FAQs — Cheez kho jane ya milne par kya karein, verification ka tareeqa aur safety tips.'
  );

  const toggle = (id) => {
    setOpenIdx(openIdx === id ? null : id);
  };

  return (
    <article className="detail-card" style={{ maxWidth: '860px', margin: '0 auto' }}>
      <header style={{ marginBottom: '28px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '18px' }}>
        <h1 style={{ fontSize: '2.4rem', margin: '0 0 10px' }}>
          {lang === 'ur' ? 'Aksar Poochay Gaye Sawalat (FAQs)' : 'Frequently Asked Questions'}
        </h1>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>
          {lang === 'ur'
            ? 'Portal ke istemal, verification aur amanat ki wapsi se mutalliq ahem sawalat ke jawabat.'
            : 'Answers to common questions regarding reporting, claiming, and verification.'}
        </p>
      </header>

      {FAQ_DATA.map((group, gIdx) => (
        <section key={group.category} style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--brand-blue)', marginBottom: '12px' }}>
            {group.category}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {group.items.map((item, iIdx) => {
              const id = `${gIdx}-${iIdx}`;
              const isOpen = openIdx === id;

              return (
                <div
                  key={item.q}
                  style={{
                    background: 'var(--bg-muted)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggle(id)}
                    style={{
                      width: '100%',
                      padding: '16px 18px',
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textAlign: 'left',
                      font: 'inherit',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                    }}
                  >
                    <span>{item.q}</span>
                    <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 18px 16px', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </article>
  );
}
