import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../api';
import ItemCard, { CATEGORIES_CONFIG, CITIES_LIST } from '../components/ItemCard.jsx';
import StatsBanner from '../components/StatsBanner.jsx';
import { useLang } from '../context/LanguageContext.jsx';
import useSEO from '../hooks/useSEO.js';

export default function Home() {
  const { lang, t } = useLang();

  useSEO(
    lang === 'ur' ? 'Sab Cheezein — Community Portal' : 'Community Directory',
    'Shehar aur mohalle ki khoyi ya mili hui cheezein talash karein, ya foran report karein taake asal maalik tak pohnch sakein.'
  );

  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('all');
  const [city, setCity] = useState('all');
  const [status, setStatus] = useState('open'); // 'open', 'resolved', 'all'
  const [sort, setSort] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch items with debounce for search
  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/items', {
          params: {
            q,
            type,
            category: category === 'all' ? undefined : category,
            city: city === 'all' ? undefined : city,
            status,
            sort,
          },
        });
        setItems(data);
        setError('');
      } catch (e) {
        setError(errMsg(e));
      }
      setLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [q, type, category, city, status, sort]);

  const resetFilters = () => {
    setQ('');
    setType('');
    setCategory('all');
    setCity('all');
    setStatus('open');
    setSort('newest');
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-wrapper">
        <div className="hero-pill">
          <span>{t.heroTag}</span>
        </div>
        <h1 className="hero-title">{t.heroTitle}</h1>
        <p className="hero-subtitle">{t.heroSubtitle}</p>

        <div className="hero-cta-group">
          <Link to="/post?type=lost" className="btn-hero-lost">
            <span>{t.reportLostBtn}</span>
          </Link>
          <Link to="/post?type=found" className="btn-hero-found">
            <span>{t.reportFoundBtn}</span>
          </Link>
        </div>

        {/* Live Platform Stats */}
        <StatsBanner />
      </section>

      {/* Filter & Search Toolbar */}
      <section className="filter-toolbar">
        {/* Top search & type row */}
        <div className="filter-search-row">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="search"
              className="search-input"
              placeholder={t.searchPlaceholder}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search items"
            />
            {q && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setQ('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Type Segment Control */}
          <div className="segmented-control" role="group" aria-label="Item Type Filter">
            <button
              type="button"
              className={`segment-btn ${type === '' ? 'active' : ''}`}
              onClick={() => setType('')}
            >
              {t.filterAll}
            </button>
            <button
              type="button"
              className={`segment-btn ${type === 'lost' ? 'active lost' : ''}`}
              onClick={() => setType('lost')}
            >
              {t.filterLost}
            </button>
            <button
              type="button"
              className={`segment-btn ${type === 'found' ? 'active found' : ''}`}
              onClick={() => setType('found')}
            >
              {t.filterFound}
            </button>
          </div>
        </div>

        {/* Selects & Sort Row */}
        <div className="filter-selects-row">
          {/* Status Filter */}
          <select
            className="custom-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Status filter"
          >
            <option value="open">
              {lang === 'ur' ? 'Halaat: Active / Open' : 'Status: Active / Open'}
            </option>
            <option value="resolved">
              {lang === 'ur' ? 'Halaat: Wapas Mil Gayi (Resolved)' : 'Status: Reunited (Resolved)'}
            </option>
            <option value="all">
              {lang === 'ur' ? 'Halaat: Sab (Active + Resolved)' : 'Status: All (Active + Reunited)'}
            </option>
          </select>

          {/* City Filter */}
          <select
            className="custom-select"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            aria-label="City filter"
          >
            <option value="all">{t.cityAll}</option>
            {CITIES_LIST.map((c) => (
              <option key={c} value={c}>
                📍 {c}
              </option>
            ))}
          </select>

          {/* Sort Selector */}
          <select
            className="custom-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort order"
          >
            <option value="newest">🕒 {t.sortNewest}</option>
            <option value="views">👁️ {t.sortViews}</option>
            <option value="oldest">⏳ {lang === 'ur' ? 'Purani Pehle' : 'Oldest First'}</option>
          </select>

          {/* View Mode Toggle */}
          <div className="view-switch-box">
            <button
              type="button"
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
              aria-label="Grid view"
            >
              ⊞
            </button>
            <button
              type="button"
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
              aria-label="List view"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="category-scroll-bar" role="tablist" aria-label="Category filter">
          <button
            type="button"
            className={`cat-pill ${category === 'all' ? 'active' : ''}`}
            onClick={() => setCategory('all')}
          >
            ✨ {t.categoryAll}
          </button>
          {Object.entries(CATEGORIES_CONFIG).map(([key, config]) => (
            <button
              key={key}
              type="button"
              className={`cat-pill ${category === key ? 'active' : ''}`}
              onClick={() => setCategory(key)}
            >
              <span>{config.icon}</span>
              <span>{config[lang === 'ur' ? 'labelUr' : 'labelEn']}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Error state */}
      {error && <p className="error">{error}</p>}

      {/* Items Section */}
      {loading ? (
        <div className="items-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="item-card"
              style={{ height: '320px', background: 'var(--bg-muted)', opacity: 0.6 }}
            >
              <div style={{ padding: '20px', textAlign: 'center', margin: 'auto' }}>
                <span style={{ fontSize: '1.5rem' }}>⏳</span>
                <p style={{ margin: '8px 0 0', color: 'var(--text-muted)' }}>{t.loadingMsg}</p>
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="detail-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '14px' }}>🔍</div>
          <h3 style={{ margin: '0 0 10px', fontSize: '1.4rem' }}>
            {lang === 'ur' ? 'Koi cheez nahi mili' : 'No Items Found'}
          </h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 20px' }}>
            {t.emptyMsg}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button type="button" className="btn-outline" onClick={resetFilters}>
              {lang === 'ur' ? 'Tamam Filters Khatam Karein' : 'Reset All Filters'}
            </button>
            <Link to="/post" className="btn-primary">
              {t.navPost}
            </Link>
          </div>
        </div>
      ) : (
        <section className={viewMode === 'grid' ? 'items-grid' : 'items-list-view'}>
          {items.map((it) => (
            <ItemCard key={it._id} item={it} />
          ))}
        </section>
      )}
    </>
  );
}
