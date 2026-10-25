import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api, { errMsg } from '../api';
import { CATEGORIES_CONFIG, CITIES_LIST } from '../components/ItemCard.jsx';
import { useLang } from '../context/LanguageContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function EditItem() {
  const { id } = useParams();
  const { lang } = useLang();
  const { showToast } = useToast();
  const nav = useNavigate();

  const [f, setF] = useState({
    type: 'lost',
    title: '',
    description: '',
    category: 'wallet',
    city: 'Karachi',
    location: '',
    date: '',
    contactName: '',
    contactPhone: '',
    whatsapp: '',
  });

  const [existingImage, setExistingImage] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .get(`/items/${id}`)
      .then((res) => {
        const item = res.data;
        setF({
          type: item.type,
          title: item.title,
          description: item.description || '',
          category: item.category || 'other',
          city: item.city || 'Karachi',
          location: item.location || '',
          date: item.date ? item.date.slice(0, 10) : '',
          contactName: item.contactName || '',
          contactPhone: item.contactPhone || '',
          whatsapp: item.whatsapp || '',
        });
        setExistingImage(item.image || '');
        setLoading(false);
      })
      .catch((e) => {
        setError(errMsg(e));
        setLoading(false);
      });
  }, [id]);

  const handleChange = (key) => (e) => {
    setF({ ...f, [key]: e.target.value });
  };

  const handleImagePick = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError(lang === 'ur' ? 'Photo 5 MB se choti honi chahiye' : 'Photo must be under 5 MB');
      return;
    }
    setError('');
    setNewImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');

    const fd = new FormData();
    Object.entries(f).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        fd.append(k, v);
      }
    });
    if (newImage) fd.append('image', newImage);

    try {
      await api.put(`/items/${id}`, fd);
      showToast(lang === 'ur' ? 'Post update ho gayi!' : 'Post updated successfully!', 'success');
      nav(`/item/${id}`);
    } catch (err) {
      setError(errMsg(err));
      showToast(errMsg(err), 'error');
    }
    setBusy(false);
  };

  if (loading) {
    return (
      <div className="form-card" style={{ textAlign: 'center', padding: '40px' }}>
        <p className="empty">Load ho raha hai...</p>
      </div>
    );
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <Link to={`/item/${id}`} className="back-nav-link">
        ← {lang === 'ur' ? 'Wapas tafseelat par' : 'Back to details'}
      </Link>

      <h2 className="form-title">
        {lang === 'ur' ? 'Post Edit Karein' : 'Edit Post'}
      </h2>
      <p className="form-subtitle">
        {lang === 'ur'
          ? 'Maloomat update karein aur save karein.'
          : 'Update post information and save changes.'}
      </p>

      {error && <p className="error" style={{ marginBottom: '18px' }}>{error}</p>}

      {/* Type Toggle */}
      <div className="segmented-control" style={{ width: '100%', marginBottom: '20px' }}>
        <button
          type="button"
          style={{ flex: 1, padding: '10px' }}
          className={`segment-btn ${f.type === 'lost' ? 'active lost' : ''}`}
          onClick={() => setF({ ...f, type: 'lost' })}
        >
          🔍 {lang === 'ur' ? 'Khoya Hai (Lost)' : 'Lost'}
        </button>
        <button
          type="button"
          style={{ flex: 1, padding: '10px' }}
          className={`segment-btn ${f.type === 'found' ? 'active found' : ''}`}
          onClick={() => setF({ ...f, type: 'found' })}
        >
          🎁 {lang === 'ur' ? 'Mila Hai (Found)' : 'Found'}
        </button>
      </div>

      <div className="form-field">
        <label className="form-label">{lang === 'ur' ? 'Cheez Ka Naam' : 'Title'} *</label>
        <input
          required
          maxLength={90}
          className="form-input"
          value={f.title}
          onChange={handleChange('title')}
        />
      </div>

      <div className="form-row-2">
        <div className="form-field">
          <label className="form-label">Category *</label>
          <select className="form-select" value={f.category} onChange={handleChange('category')}>
            {Object.entries(CATEGORIES_CONFIG).map(([k, cfg]) => (
              <option key={k} value={k}>
                {cfg.icon} {cfg[lang === 'ur' ? 'labelUr' : 'labelEn']}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label className="form-label">{lang === 'ur' ? 'Shehar' : 'City'} *</label>
          <select className="form-select" value={f.city} onChange={handleChange('city')}>
            {CITIES_LIST.map((c) => (
              <option key={c} value={c}>
                📍 {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row-2">
        <div className="form-field">
          <label className="form-label">{lang === 'ur' ? 'Khas Jagah' : 'Location'} *</label>
          <input
            required
            className="form-input"
            value={f.location}
            onChange={handleChange('location')}
          />
        </div>

        <div className="form-field">
          <label className="form-label">{lang === 'ur' ? 'Tareekh' : 'Date'} *</label>
          <input
            type="date"
            required
            className="form-input"
            value={f.date}
            onChange={handleChange('date')}
          />
        </div>
      </div>

      <div className="form-field">
        <label className="form-label">{lang === 'ur' ? 'Tafseel' : 'Description'}</label>
        <textarea
          rows={3}
          maxLength={600}
          className="form-textarea"
          value={f.description}
          onChange={handleChange('description')}
        />
      </div>


      <div className="form-row-2">
        <div className="form-field">
          <label className="form-label">{lang === 'ur' ? 'Rabta Name' : 'Contact Name'}</label>
          <input
            className="form-input"
            value={f.contactName}
            onChange={handleChange('contactName')}
          />
        </div>

        <div className="form-field">
          <label className="form-label">{lang === 'ur' ? 'Phone Number' : 'Phone'} *</label>
          <input
            type="tel"
            required
            className="form-input"
            value={f.contactPhone}
            onChange={handleChange('contactPhone')}
          />
        </div>
      </div>

      <div className="form-field">
        <label className="form-label">WhatsApp Number</label>
        <input
          type="tel"
          className="form-input"
          value={f.whatsapp}
          onChange={handleChange('whatsapp')}
        />
      </div>

      {/* Image update */}
      <div className="form-field">
        <label className="form-label">
          📷 {lang === 'ur' ? 'Tasweer Update Karein' : 'Update Photo'}
        </label>
        {(preview || existingImage) && (
          <div className="image-preview-box" style={{ marginBottom: '10px' }}>
            <img
              src={preview || `/uploads/${existingImage}`}
              alt="Item"
            />
          </div>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          onChange={(e) => handleImagePick(e.target.files[0])}
        />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
        <Link to={`/item/${id}`} className="btn-outline" style={{ flex: 1, textAlign: 'center' }}>
          {lang === 'ur' ? 'Cancel' : 'Cancel'}
        </Link>
        <button
          type="submit"
          className="btn-primary"
          style={{ flex: 2 }}
          disabled={busy}
        >
          {busy
            ? (lang === 'ur' ? 'Save ho raha hai...' : 'Saving...')
            : (lang === 'ur' ? '✓ Changes Save Karein' : '✓ Save Changes')}
        </button>
      </div>
    </form>
  );
}
