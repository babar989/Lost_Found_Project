import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api, { errMsg } from '../api';
import { CATEGORIES_CONFIG, CITIES_LIST } from '../components/ItemCard.jsx';
import useSEO from '../hooks/useSEO';
import { useAuth } from '../context/AuthContext.jsx';
import { useLang } from '../context/LanguageContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function PostItem() {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') === 'found' ? 'found' : 'lost';

  const { user } = useAuth();
  const { lang } = useLang();
  const { showToast } = useToast();
  const nav = useNavigate();

  useSEO(
    lang === 'ur' ? 'Cheez Report / Post Karein' : 'Report an Item',
    'Khoyi ya mili hui cheez ki mukammal tafseel, model number, aur photo report karein.'
  );

  const [f, setF] = useState({
    type: initialType,
    title: '',
    description: '',
    category: 'wallet',
    city: 'Karachi',
    location: '',
    date: new Date().toISOString().slice(0, 10),
    contactName: user?.name || '',
    contactPhone: user?.phone || '',
    whatsapp: user?.phone || '',
    brand: '',
    modelNumber: '',
    color: '',
    condition: 'Used / Good',
    identifyingMarks: '',
    claimRequirement: '',
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sameAsPhone, setSameAsPhone] = useState(true);

  useEffect(() => {
    if (user) {
      setF((prev) => ({
        ...prev,
        contactName: prev.contactName || user.name || '',
        contactPhone: prev.contactPhone || user.phone || '',
        whatsapp: prev.whatsapp || user.phone || '',
      }));
    }
  }, [user]);

  const handleChange = (key) => (e) => {
    const val = e.target.value;
    setF((prev) => {
      const updated = { ...prev, [key]: val };
      if (key === 'contactPhone' && sameAsPhone) {
        updated.whatsapp = val;
      }
      return updated;
    });
  };

  const handleImagePick = (fileList) => {
    if (!fileList || fileList.length === 0) return;
    const selected = Array.from(fileList);

    if (images.length + selected.length > 5) {
      setError(lang === 'ur' ? 'Aap zyada se zyada 5 photos laga sakte hain' : 'You can upload maximum 5 photos');
      return;
    }

    const validFiles = [];
    const newPreviews = [];

    for (const file of selected) {
      if (file.size > 5 * 1024 * 1024) {
        setError(lang === 'ur' ? 'Har photo 5 MB se choti honi chahiye' : 'Each photo must be under 5 MB');
        return;
      }
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    setError('');
    setImages((prev) => [...prev, ...validFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImageAt = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
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

    images.forEach((img) => {
      fd.append('images', img);
    });

    try {
      const { data } = await api.post('/items', fd);
      showToast(
        lang === 'ur' ? 'Cheez kamyabi se post ho gayi!' : 'Item reported successfully!',
        'success'
      );
      nav(`/item/${data._id}`);
    } catch (err) {
      setError(errMsg(err));
      showToast(errMsg(err), 'error');
    }
    setBusy(false);
  };

  return (
    <form className="form-card" onSubmit={submit}>
      <h1 className="form-title" style={{ fontSize: '1.9rem' }}>
        {lang === 'ur' ? 'Cheez Report / Post Karein' : 'Report an Item'}
      </h1>
      <p className="form-subtitle">
        {lang === 'ur'
          ? 'Asal photos, model number aur saaf nishaniyan darj karein taake tasdeeq aasan ho sake.'
          : 'Provide real photos, model identifiers, and exact marks to facilitate secure verification.'}
      </p>

      {error && <p className="error" style={{ marginBottom: '18px' }}>{error}</p>}

      {/* Type Toggle */}
      <div className="segmented-control" style={{ width: '100%', marginBottom: '22px' }} role="group">
        <button
          type="button"
          style={{ flex: 1, padding: '12px', fontSize: '1rem' }}
          className={`segment-btn ${f.type === 'lost' ? 'active lost' : ''}`}
          onClick={() => setF({ ...f, type: 'lost' })}
        >
          🔍 {lang === 'ur' ? 'Meri Cheez Khoyi Hai' : 'I Lost an Item'}
        </button>
        <button
          type="button"
          style={{ flex: 1, padding: '12px', fontSize: '1rem' }}
          className={`segment-btn ${f.type === 'found' ? 'active found' : ''}`}
          onClick={() => setF({ ...f, type: 'found' })}
        >
          🎁 {lang === 'ur' ? 'Mujhe Cheez Mili Hai' : 'I Found an Item'}
        </button>
      </div>

      {/* Title */}
      <div className="form-field">
        <label className="form-label">
          {lang === 'ur' ? 'Cheez Ka Naam (Title)' : 'Item Title'} *
        </label>
        <input
          required
          maxLength={100}
          className="form-input"
          placeholder={lang === 'ur' ? 'Jaise: Black Bi-Fold Leather Wallet ya Apple iPhone 13' : 'e.g., Apple iPhone 13 (Sierra Blue)'}
          value={f.title}
          onChange={handleChange('title')}
        />
      </div>

      {/* Category & City Row */}
      <div className="form-row-2">
        <div className="form-field">
          <label className="form-label">Category *</label>
          <select
            className="form-select"
            value={f.category}
            onChange={handleChange('category')}
          >
            {Object.entries(CATEGORIES_CONFIG).map(([k, cfg]) => (
              <option key={k} value={k}>
                {cfg.icon} {cfg[lang === 'ur' ? 'labelUr' : 'labelEn']}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label className="form-label">
            {lang === 'ur' ? 'Shehar / City' : 'City'} *
          </label>
          <select
            className="form-select"
            value={f.city}
            onChange={handleChange('city')}
          >
            {CITIES_LIST.map((c) => (
              <option key={c} value={c}>
                📍 {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Location & Date Row */}
      <div className="form-row-2">
        <div className="form-field">
          <label className="form-label">
            {lang === 'ur' ? 'Khas Jagah / Area' : 'Specific Location'} *
          </label>
          <input
            required
            className="form-input"
            placeholder={lang === 'ur' ? 'Jaise: Saddar Metro Station Counter ya Liberty Market' : 'e.g., Saddar Metro Station'}
            value={f.location}
            onChange={handleChange('location')}
          />
        </div>

        <div className="form-field">
          <label className="form-label">
            {f.type === 'lost'
              ? (lang === 'ur' ? 'Kab Khoyi' : 'Date Lost')
              : (lang === 'ur' ? 'Kab Mili' : 'Date Found')} *
          </label>
          <input
            type="date"
            required
            max={new Date().toISOString().slice(0, 10)}
            className="form-input"
            value={f.date}
            onChange={handleChange('date')}
          />
        </div>
      </div>

      {/* Real Specifications Group */}
      <div style={{
        background: 'var(--bg-muted)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        margin: '12px 0 20px',
      }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '12px', color: 'var(--text-main)' }}>
          📋 {lang === 'ur' ? 'Specifications & Details (Zaroori Nishaniyan)' : 'Item Specifications'}
        </div>

        <div className="form-row-2">
          <div className="form-field">
            <label className="form-label">{lang === 'ur' ? 'Brand / Company' : 'Brand / Manufacturer'}</label>
            <input
              className="form-input"
              placeholder="e.g., Apple, Honda, J., Dell, NADRA"
              value={f.brand}
              onChange={handleChange('brand')}
            />
          </div>

          <div className="form-field">
            <label className="form-label">{lang === 'ur' ? 'Model Number / Serial' : 'Model / Serial Number'}</label>
            <input
              className="form-input"
              placeholder="e.g., A2633, CD-70, Inspiron 15"
              value={f.modelNumber}
              onChange={handleChange('modelNumber')}
            />
          </div>
        </div>

        <div className="form-row-2">
          <div className="form-field">
            <label className="form-label">{lang === 'ur' ? 'Rang (Color)' : 'Color'}</label>
            <input
              className="form-input"
              placeholder="e.g., Black, Blue, Silver"
              value={f.color}
              onChange={handleChange('color')}
            />
          </div>

          <div className="form-field">
            <label className="form-label">{lang === 'ur' ? 'Halaat (Condition)' : 'Physical Condition'}</label>
            <select
              className="form-select"
              value={f.condition}
              onChange={handleChange('condition')}
            >
              <option value="Brand New">Brand New / Packed</option>
              <option value="Like New">Like New / Excellent</option>
              <option value="Used / Good">Used / Good Condition</option>
              <option value="Fair / Scratched">Fair / Noticeable Scratches</option>
              <option value="Not Specified">Not Specified</option>
            </select>
          </div>
        </div>

        <div className="form-field" style={{ marginBottom: 0 }}>
          <label className="form-label">{lang === 'ur' ? 'Khas Pehchan / Nishani (Identifying Marks)' : 'Unique Identifying Marks'}</label>
          <input
            className="form-input"
            placeholder={lang === 'ur' ? 'Jaise: Screen par chota scratch, sticker, ya khusoosi keychain' : 'e.g., Small scratch on corner, blue keychain'}
            value={f.identifyingMarks}
            onChange={handleChange('identifyingMarks')}
          />
        </div>
      </div>

      {/* Description */}
      <div className="form-field">
        <label className="form-label">
          {lang === 'ur' ? 'Mukammal Tafseel (Fact-Based Description)' : 'Fact-Based Description'}
        </label>
        <textarea
          rows={3}
          maxLength={800}
          className="form-textarea"
          placeholder={lang === 'ur' ? 'Cheez ke baray mein mazeed sachhi aur wazeh maloomat likhein...' : 'Provide clear, factual description of how and where the item was lost/found...'}
          value={f.description}
          onChange={handleChange('description')}
        />
      </div>

      {/* Verification / Claim Requirement */}
      <div className="form-field">
        <label className="form-label">
          🛡️ {lang === 'ur' ? 'Wapsi Ki Shart / Claim Verification Requirement' : 'Ownership Proof Required'}
        </label>
        <input
          className="form-input"
          placeholder={lang === 'ur' ? 'Jaise: Asal maalik CNIC ya device unlock kar ke dikhaye' : 'e.g., Must show matching CNIC or unlock device'}
          value={f.claimRequirement}
          onChange={handleChange('claimRequirement')}
        />
      </div>

      {/* Multi-Image Upload (3-5 Images Support) */}
      <div className="form-field">
        <label className="form-label">
          📷 {lang === 'ur' ? 'Asal Photos (1 se 5 Photos Lagayein)' : 'Original Photos (1 to 5 Photos)'}
        </label>

        {previews.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {previews.map((prev, idx) => (
              <div key={idx} style={{ position: 'relative', width: '90px', height: '90px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                <img src={prev} alt={`Upload ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={() => removeImageAt(idx)}
                  className="btn-remove-img"
                  style={{ width: '22px', height: '22px', fontSize: '0.75rem' }}
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {images.length < 5 && (
          <label className="image-dropzone">
            <span style={{ fontSize: '1.8rem' }}>📁</span>
            <div style={{ fontWeight: 700, margin: '4px 0 2px' }}>
              {lang === 'ur' ? 'Original Photos Select Karein (Multiple files allowed)' : 'Upload Real Product/Item Photos'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              PNG, JPG, WEBP (upto 5 photos, max 5 MB each)
            </div>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/jpg"
              style={{ display: 'none' }}
              onChange={(e) => handleImagePick(e.target.files)}
            />
          </label>
        )}
      </div>

      {/* Contact Details */}
      <div style={{ margin: '20px 0 10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
        <div style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 12px' }}>
          📞 {lang === 'ur' ? 'Rabta Ki Maloomat (Contact Details)' : 'Contact Information'}
        </div>
      </div>

      <div className="form-row-2">
        <div className="form-field">
          <label className="form-label">{lang === 'ur' ? 'Aapka Naam' : 'Contact Person Name'}</label>
          <input
            className="form-input"
            placeholder="Ahmed Khan"
            value={f.contactName}
            onChange={handleChange('contactName')}
          />
        </div>

        <div className="form-field">
          <label className="form-label">{lang === 'ur' ? 'Phone Number' : 'Phone Number'} *</label>
          <input
            type="tel"
            required
            className="form-input"
            placeholder="0300 1234567"
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
          placeholder="0300 1234567"
          value={f.whatsapp}
          onChange={handleChange('whatsapp')}
        />
      </div>

      <button
        type="submit"
        className="btn-primary"
        style={{ width: '100%', marginTop: '16px', padding: '14px', fontSize: '1.05rem' }}
        disabled={busy}
      >
        {busy
          ? (lang === 'ur' ? 'Post ho rahi hai...' : 'Publishing...')
          : (lang === 'ur' ? '✓ Post Publish Karein' : '✓ Publish Item')}
      </button>
    </form>
  );
}
