import { useEffect } from 'react';
import { CATEGORIES_CONFIG, formatDate } from './ItemCard.jsx';
import { useLang } from '../context/LanguageContext.jsx';

export default function FlyerModal({ item, onClose }) {
  const { lang } = useLang();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const isLost = item.type === 'lost';
  const cat = CATEGORIES_CONFIG[item.category] || CATEGORIES_CONFIG.other;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="flyer-modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>
            {lang === 'ur' ? 'Gumshuda Talash Poster (Print / PDF)' : 'Lost & Found Notice Flyer'}
          </h3>
          <button
            type="button"
            className="btn-outline"
            style={{ padding: '4px 10px', fontSize: '0.9rem' }}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Printable Flyer Sheet */}
        <div className={`flyer-sheet ${isLost ? 'lost-flyer' : 'found-flyer'}`}>
          <div className="flyer-headline">
            {isLost
              ? (lang === 'ur' ? '⚠️ GUMSHUDA TALASH ⚠️' : '⚠️ LOST ITEM NOTICE ⚠️')
              : (lang === 'ur' ? '🎉 MILI HUI CHEEZ 🎉' : '🎉 FOUND ITEM NOTICE 🎉')}
          </div>
          <div className="flyer-subhead">
            {isLost
              ? (lang === 'ur' ? 'Agar kisi ko mile to baraye meherbani foran rabta karein' : 'Please contact immediately if you have any information')
              : (lang === 'ur' ? 'Asal maalik nishaniyan bata kar hasil kar sakte hain' : 'Owner can verify ownership details to claim')}
          </div>

          <h2 style={{ fontSize: '1.8rem', margin: '10px 0', color: '#111827' }}>
            {item.title}
          </h2>

          {item.image && (
            <img
              src={`/uploads/${item.image}`}
              alt={item.title}
              className="flyer-photo"
            />
          )}

          <div style={{ textAlign: 'left', margin: '14px 0', fontSize: '0.95rem', color: '#374151' }}>
            <p><strong>Category:</strong> {cat.icon} {cat[lang === 'ur' ? 'labelUr' : 'labelEn']}</p>
            <p><strong>Jagah / Location:</strong> {item.city ? `${item.city}, ` : ''}{item.location}</p>
            <p><strong>Tareekh / Date:</strong> {formatDate(item.date, lang)}</p>
            {item.description && <p><strong>Tafseel / Description:</strong> {item.description}</p>}
          </div>

          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            padding: '10px',
            margin: '12px 0',
            fontWeight: 700,
            fontSize: '0.9rem',
            color: '#166534',
          }}>
            🤝 100% Free Community Service · Baraye Insaniyat
          </div>

          <div className="flyer-contact-box">
            <div style={{ fontSize: '0.88rem', fontWeight: 700, textTransform: 'uppercase', color: '#6b7280' }}>
              Baraye Rabta / Contact Person: {item.contactName || (item.user?.name || '')}
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#111827', margin: '4px 0' }}>
              📞 {item.contactPhone}
            </div>
            {item.whatsapp && item.whatsapp !== item.contactPhone && (
              <div style={{ fontSize: '1rem', color: '#047857', fontWeight: 700 }}>
                💬 WhatsApp: {item.whatsapp}
              </div>
            )}
          </div>

          <div style={{ marginTop: '16px', fontSize: '0.75rem', color: '#9ca3af' }}>
            Published via Lost &amp; Found Portal · Verify &amp; Connect Safely
          </div>
        </div>

        {/* Modal Controls */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px', justifyContent: 'flex-end' }}>
          <button type="button" className="btn-outline" onClick={onClose}>
            {lang === 'ur' ? 'Band Karein' : 'Close'}
          </button>
          <button type="button" className="btn-primary" onClick={handlePrint}>
            🖨️ {lang === 'ur' ? 'Print / PDF Save Karein' : 'Print / Save as PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
