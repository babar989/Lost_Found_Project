import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export const CATEGORIES_CONFIG = {
  phone: { labelUr: 'Phone', labelEn: 'Phone', icon: '📱' },
  wallet: { labelUr: 'Wallet / Batwa', labelEn: 'Wallet / Purse', icon: '👛' },
  bag: { labelUr: 'Bag / Basta', labelEn: 'Bag / Backpack', icon: '🎒' },
  keys: { labelUr: 'Chabiyan', labelEn: 'Keys', icon: '🔑' },
  documents: { labelUr: 'Documents / CNIC', labelEn: 'Documents / ID', icon: '📄' },
  electronics: { labelUr: 'Electronics', labelEn: 'Electronics', icon: '💻' },
  pet: { labelUr: 'Paltu Janwar', labelEn: 'Pet / Animal', icon: '🐾' },
  jewellery: { labelUr: 'Jewellery / Ghari', labelEn: 'Jewellery / Watch', icon: '💍' },
  vehicles: { labelUr: 'Gari / Bike', labelEn: 'Vehicle / Bike', icon: '🚲' },
  clothing: { labelUr: 'Kapre / Jootay', labelEn: 'Clothes / Shoes', icon: '👕' },
  other: { labelUr: 'Aur Kuch', labelEn: 'Other Items', icon: '📦' },
};

export const CITIES_LIST = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Peshawar',
  'Faisalabad',
  'Multan',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Other',
];

export const formatDate = (d, lang = 'ur') => {
  if (!d) return '';
  return new Date(d).toLocaleDateString(lang === 'ur' ? 'en-GB' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export default function ItemCard({ item, children }) {
  const { lang, t } = useLang();
  const { showToast } = useToast();

  const cat = CATEGORIES_CONFIG[item.category] || CATEGORIES_CONFIG.other;
  const isResolved = item.status === 'resolved';

  const cleanPhone = (item.whatsapp || item.contactPhone || '').replace(/\D/g, '');
  const waPhone = cleanPhone.startsWith('0') ? '92' + cleanPhone.slice(1) : cleanPhone;
  const waGreeting = encodeURIComponent(
    lang === 'ur'
      ? `Assalam-o-Alaikum, maine Lost & Found portal par aapki post "${item.title}" dekhi hai.`
      : `Hello, I saw your post "${item.title}" on the Lost & Found portal.`
  );

  const copyShareLink = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/item/${item._id}`;
    navigator.clipboard.writeText(url);
    showToast(lang === 'ur' ? 'Link copy ho gaya!' : 'Link copied to clipboard!', 'success');
  };

  return (
    <article
      className={`item-card type-${item.type} ${isResolved ? 'is-resolved' : ''}`}
      id={`item-${item._id}`}
    >
      <span className="card-punch-hole" aria-hidden="true" />

      {/* Image / Thumbnail */}
      <Link to={`/item/${item._id}`} className="card-img-container">
        {item.image ? (
          <img
            src={`/uploads/${item.image}`}
            alt={item.title}
            className="card-img"
            loading="lazy"
          />
        ) : (
          <div className="card-no-img">
            <span className="card-no-img-icon">{cat.icon}</span>
            <span>{cat[lang === 'ur' ? 'labelUr' : 'labelEn']}</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="card-badges-top">
          <span className={`badge-chip ${item.type}`}>
            {item.type === 'lost' ? (lang === 'ur' ? 'Khoya Hai' : 'Lost') : (lang === 'ur' ? 'Mila Hai' : 'Found')}
          </span>
          {isResolved && (
            <span className="badge-chip resolved">
              ✓ {lang === 'ur' ? 'Wapas Mil Gayi' : 'Reunited'}
            </span>
          )}
        </div>
      </Link>

      {/* Card Content */}
      <div className="card-content">
        <div className="card-cat-meta">
          <span>
            {cat.icon} {cat[lang === 'ur' ? 'labelUr' : 'labelEn']}
          </span>
          {item.views > 0 && <span>👁️ {item.views}</span>}
        </div>

        <Link to={`/item/${item._id}`}>
          <h3 className="card-title" title={item.title}>
            {item.title}
          </h3>
        </Link>

        <div className="card-meta-row">
          <span>📍</span>
          <span>
            {item.city ? `${item.city} · ` : ''}
            {item.location}
          </span>
        </div>

        <div className="card-meta-row" style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          <span>📅</span>
          <span>{formatDate(item.date, lang)}</span>
        </div>

        {/* Footer Actions */}
        <div className="card-footer">
          <Link
            to={`/item/${item._id}`}
            className="btn-outline"
            style={{ padding: '6px 12px', fontSize: '0.82rem' }}
          >
            {lang === 'ur' ? 'Tafseelat Dekhein' : 'View Details'}
          </Link>

          <div className="card-quick-actions">
            {/* Share */}
            <button
              type="button"
              className="btn-icon-action"
              onClick={copyShareLink}
              title={lang === 'ur' ? 'Share karein' : 'Share link'}
              aria-label="Share post"
            >
              🔗
            </button>

            {/* WhatsApp */}
            {cleanPhone && !isResolved && (
              <a
                href={`https://wa.me/${waPhone}?text=${waGreeting}`}
                target="_blank"
                rel="noreferrer"
                className="btn-icon-action whatsapp"
                title="WhatsApp par rabta karein"
                aria-label="WhatsApp"
              >
                💬
              </a>
            )}

            {/* Phone Call */}
            {item.contactPhone && !isResolved && (
              <a
                href={`tel:${item.contactPhone}`}
                className="btn-icon-action call"
                title={`Call: ${item.contactPhone}`}
                aria-label="Call"
              >
                📞
              </a>
            )}
          </div>
        </div>

        {/* Optional Slot for Owner action buttons */}
        {children}
      </div>
    </article>
  );
}
