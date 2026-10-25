import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { errMsg } from '../api';
import { CATEGORIES_CONFIG, formatDate } from '../components/ItemCard.jsx';
import FlyerModal from '../components/FlyerModal.jsx';
import useSEO from '../hooks/useSEO';
import { useAuth } from '../context/AuthContext.jsx';
import { useLang } from '../context/LanguageContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function ItemDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { lang, t } = useLang();
  const { showToast } = useToast();
  const nav = useNavigate();

  const [item, setItem] = useState(null);
  const [error, setError] = useState('');
  const [showFlyer, setShowFlyer] = useState(false);
  const [selectedImg, setSelectedImg] = useState(0);

  // Inquiries state
  const [inqName, setInqName] = useState(user?.name || '');
  const [inqPhone, setInqPhone] = useState(user?.phone || '');
  const [inqMsg, setInqMsg] = useState('');
  const [submittingInq, setSubmittingInq] = useState(false);

  useEffect(() => {
    api
      .get(`/items/${id}`)
      .then((r) => setItem(r.data))
      .catch((e) => setError(errMsg(e)));
  }, [id]);

  // Set unique dynamic title and SEO description
  useSEO(
    item ? `${item.title} (${item.type === 'lost' ? 'Khoyi Hui' : 'Mili Hui'})` : 'Item Detail',
    item?.description || 'Lost & Found Community portal par item ki mukammal tafseel aur rabta number.'
  );

  if (error) {
    return (
      <div className="detail-card" style={{ textAlign: 'center', padding: '40px' }}>
        <p className="error">{error}</p>
        <Link to="/" className="btn-outline" style={{ marginTop: '16px' }}>
          ← {lang === 'ur' ? 'Wapas jayein' : 'Go Back Home'}
        </Link>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="detail-card" style={{ textAlign: 'center', padding: '60px' }}>
        <p className="empty">{t.loadingMsg}</p>
      </div>
    );
  }

  const isOwner = Boolean(user && item.user && (item.user._id === user.id || item.user === user.id));
  const cat = CATEGORIES_CONFIG[item.category] || CATEGORIES_CONFIG.other;
  const isResolved = item.status === 'resolved';

  const cleanPhone = (item.whatsapp || item.contactPhone || '').replace(/\D/g, '');
  const waPhone = cleanPhone.startsWith('0') ? '92' + cleanPhone.slice(1) : cleanPhone;
  const waGreeting = encodeURIComponent(
    lang === 'ur'
      ? `Assalam-o-Alaikum, maine Lost & Found portal par aapki post "${item.title}" dekhi hai.`
      : `Hello, I saw your post "${item.title}" on the Lost & Found portal.`
  );

  // Build images array
  const allImages = item.images && item.images.length > 0 ? item.images : item.image ? [item.image] : [];

  const toggleResolved = async () => {
    try {
      const { data } = await api.put(`/items/${id}/resolve`);
      setItem({ ...item, status: data.status, resolvedDate: data.resolvedDate });
      showToast(
        data.status === 'resolved'
          ? (lang === 'ur' ? 'Mubarak! Cheez wapas mil gayi mark ho gayi.' : 'Item marked as Reunited!')
          : (lang === 'ur' ? 'Post dobara open ho gayi.' : 'Item status reopened.'),
        'success'
      );
    } catch (e) {
      showToast(errMsg(e), 'error');
    }
  };

  const removePost = async () => {
    if (
      !window.confirm(
        lang === 'ur'
          ? 'Kya aap sach mein ye post hamesha ke liye delete karna chahte hain?'
          : 'Are you sure you want to permanently delete this post?'
      )
    ) {
      return;
    }
    try {
      await api.delete(`/items/${id}`);
      showToast(lang === 'ur' ? 'Post kamyabi se delete ho gayi' : 'Post deleted successfully', 'success');
      nav('/mine');
    } catch (e) {
      showToast(errMsg(e), 'error');
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast(lang === 'ur' ? 'Link copy ho gaya!' : 'Link copied to clipboard!', 'success');
  };

  const submitInquiry = async (e) => {
    e.preventDefault();
    if (!inqName || !inqMsg) return;
    setSubmittingInq(true);
    try {
      const { data } = await api.post(`/items/${id}/inquiries`, {
        name: inqName,
        phone: inqPhone,
        message: inqMsg,
      });
      setItem((prev) => ({
        ...prev,
        inquiries: [...(prev.inquiries || []), data],
      }));
      setInqMsg('');
      showToast(lang === 'ur' ? 'Aapka paigham post ho gaya' : 'Your tip/message was submitted', 'success');
    } catch (err) {
      showToast(errMsg(err), 'error');
    }
    setSubmittingInq(false);
  };

  const deleteInquiry = async (inqId) => {
    try {
      await api.delete(`/items/${id}/inquiries/${inqId}`);
      setItem((prev) => ({
        ...prev,
        inquiries: prev.inquiries.filter((inq) => inq._id !== inqId),
      }));
      showToast(lang === 'ur' ? 'Paigham delete ho gaya' : 'Message deleted', 'info');
    } catch (err) {
      showToast(errMsg(err), 'error');
    }
  };

  return (
    <>
      <article className="detail-card">
        <Link to="/" className="back-nav-link">
          ← {lang === 'ur' ? 'Wapas sab cheezon par' : 'Back to all items'}
        </Link>

        <div className="detail-layout">
          {/* Left Column: Image Gallery (3-5 Images Support) */}
          <div>
            <div className="detail-img-box">
              {allImages.length > 0 ? (
                <img
                  src={`/uploads/${allImages[selectedImg] || allImages[0]}`}
                  alt={item.title}
                  style={{ width: '100%', maxHeight: '440px', objectFit: 'contain', background: '#0000000a' }}
                />
              ) : (
                <div className="card-no-img" style={{ height: '360px' }}>
                  <span style={{ fontSize: '4rem' }}>{cat.icon}</span>
                  <span style={{ fontSize: '1.2rem', marginTop: '10px' }}>
                    {cat[lang === 'ur' ? 'labelUr' : 'labelEn']}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                    {lang === 'ur' ? 'Tasweer upload nahi ki gayi' : 'No photo uploaded'}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Row if multiple images */}
            {allImages.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImg(idx)}
                    style={{
                      border: selectedImg === idx ? '2px solid var(--brand-blue)' : '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      padding: 0,
                      background: 'none',
                      cursor: 'pointer',
                      width: '64px',
                      height: '64px',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={`/uploads/${img}`}
                      alt={`Thumbnail ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn-outline"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setShowFlyer(true)}
              >
                {t.generateFlyer}
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={copyLink}
                title="Copy link"
              >
                🔗 {lang === 'ur' ? 'Share' : 'Share'}
              </button>
            </div>
          </div>

          {/* Right Column: Information, Specifications & Claim Policy */}
          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
              <span className={`badge-chip ${item.type}`}>
                {item.type === 'lost'
                  ? (lang === 'ur' ? 'Khoya Hai (Lost)' : 'Lost Item')
                  : (lang === 'ur' ? 'Mila Hai (Found)' : 'Found Item')}
              </span>
              {isResolved && (
                <span className="badge-chip resolved">
                  ✓ {lang === 'ur' ? 'Wapas Mil Gayi (Reunited)' : 'Reunited'}
                </span>
              )}
              {item.views > 0 && (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginLeft: 'auto' }}>
                  👁️ {item.views} views
                </span>
              )}
            </div>

            <h1 style={{ fontSize: '2.1rem', margin: '8px 0 14px', lineHeight: 1.25 }}>
              {item.title}
            </h1>

            {/* Description */}
            {item.description && (
              <div style={{
                background: 'var(--bg-muted)',
                padding: '16px 18px',
                borderRadius: 'var(--radius-md)',
                margin: '14px 0',
                borderLeft: '4px solid var(--brand-blue)',
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  {lang === 'ur' ? 'Tafseel & Nishaniyan' : 'Description'}
                </div>
                <p style={{ margin: 0, fontSize: '0.98rem', whiteSpace: 'pre-line' }}>
                  {item.description}
                </p>
              </div>
            )}

            {/* Real Item Specifications */}
            <div style={{
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              margin: '16px 0',
              background: 'var(--bg-surface)'
            }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>
                📋 {lang === 'ur' ? 'Asal Specifications & Nishaniyan' : 'Item Specifications'}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 18px', fontSize: '0.92rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Brand / Manufacturer: </span>
                  <strong>{item.brand || 'Not Specified'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Model / Serial: </span>
                  <strong>{item.modelNumber || 'Available on request'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Color: </span>
                  <strong>{item.color || 'Standard'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Condition: </span>
                  <strong>{item.condition || 'Used / Good'}</strong>
                </div>
              </div>

              {item.identifyingMarks && (
                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed var(--border-subtle)', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Identifying Marks: </span>
                  <span>{item.identifyingMarks}</span>
                </div>
              )}
            </div>

            {/* Metadata list */}
            <dl className="detail-meta-list" style={{ margin: '14px 0' }}>
              <dt className="detail-dt">Category:</dt>
              <dd className="detail-dd">
                {cat.icon} {cat[lang === 'ur' ? 'labelUr' : 'labelEn']}
              </dd>

              <dt className="detail-dt">{lang === 'ur' ? 'Shehar / City:' : 'City:'}</dt>
              <dd className="detail-dd">{item.city || 'Pakistan'}</dd>

              <dt className="detail-dt">{lang === 'ur' ? 'Jagah / Location:' : 'Location:'}</dt>
              <dd className="detail-dd">{item.location}</dd>

              <dt className="detail-dt">
                {item.type === 'lost'
                  ? (lang === 'ur' ? 'Kab Khoyi:' : 'Lost Date:')
                  : (lang === 'ur' ? 'Kab Mili:' : 'Found Date:')}
              </dt>
              <dd className="detail-dd">{formatDate(item.date, lang)}</dd>

              <dt className="detail-dt">{lang === 'ur' ? 'Post Karne Wala:' : 'Reported By:'}</dt>
              <dd className="detail-dd">
                {item.contactName || item.user?.name || (lang === 'ur' ? 'Community Member' : 'Citizen')}
              </dd>
            </dl>

            {/* Verification / Claim Requirement Policy */}
            <div style={{
              background: 'rgba(37, 99, 235, 0.05)',
              border: '1px solid rgba(37, 99, 235, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              fontSize: '0.88rem',
              margin: '14px 0',
            }}>
              <strong>🛡️ Verification &amp; Claim Policy: </strong>
              <span>
                {item.claimRequirement ||
                  (lang === 'ur'
                    ? 'Cheez hasil karte waqt asal maalik apna CNIC dikhayein aur nishaniyon ki tauseeq karein. Hamesha din ke waqt public jagah par mulaqaat karein.'
                    : 'Claimant must present valid photo identification and verify unique device / item identifiers. Handover in public daytime locations.')}
              </span>
            </div>

            {/* Direct Contact Buttons */}
            {!isResolved ? (
              <div className="detail-actions-panel" style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  {t.contactOwner}
                </div>
                <div className="contact-buttons-row">
                  {cleanPhone && (
                    <a
                      href={`https://wa.me/${waPhone}?text=${waGreeting}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-whatsapp"
                    >
                      💬 {t.chatWhatsapp}
                    </a>
                  )}
                  {item.contactPhone && (
                    <a href={`tel:${item.contactPhone}`} className="btn-call">
                      📞 {t.callNow}: {item.contactPhone}
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div style={{
                background: 'var(--resolved-purple-soft)',
                border: '1.5px solid var(--resolved-purple)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                marginTop: '16px',
                textAlign: 'center',
                fontWeight: 700,
              }}>
                🎉 {lang === 'ur' ? 'Alhamdulillah! Yeh cheez wapas mil chuki hai.' : 'Success! This item has been reunited.'}
              </div>
            )}

            {/* Owner Control Actions */}
            {isOwner && (
              <div className="owner-control-bar">
                <button
                  type="button"
                  className={isResolved ? 'btn-outline' : 'btn-primary'}
                  style={{ fontSize: '0.9rem' }}
                  onClick={toggleResolved}
                >
                  {isResolved
                    ? (lang === 'ur' ? 'Dobara Open Karein' : 'Reopen Post')
                    : (lang === 'ur' ? '✓ Cheez Wapas Mil Gayi' : '✓ Mark Reunited')}
                </button>

                <Link
                  to={`/edit/${item._id}`}
                  className="btn-outline"
                  style={{ fontSize: '0.9rem' }}
                >
                  ✏️ {lang === 'ur' ? 'Post Edit Karein' : 'Edit Post'}
                </Link>

                <button
                  type="button"
                  className="btn-danger-outline"
                  style={{ fontSize: '0.9rem', marginLeft: 'auto' }}
                  onClick={removePost}
                >
                  🗑️ {lang === 'ur' ? 'Delete' : 'Delete'}
                </button>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Item-specific FAQs if present */}
      {item.faqs && item.faqs.length > 0 && (
        <section className="detail-card" style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.3rem', margin: '0 0 14px' }}>
            ❓ Is Cheez Ke Baray Mein Sawalat (FAQs)
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {item.faqs.map((faq, idx) => (
              <div key={idx} style={{ background: 'var(--bg-muted)', padding: '12px 16px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontWeight: 700, marginBottom: '4px' }}>Q: {faq.question}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>A: {faq.answer}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Community Inquiries & Leads Section */}
      <section className="inquiries-section">
        <h2 style={{ fontSize: '1.35rem', margin: '0 0 12px' }}>
          💬 {t.inquiriesTitle} ({item.inquiries?.length || 0})
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 20px' }}>
          {lang === 'ur'
            ? 'Agar aap ne yeh cheez kahin dekhi hai, ya aap is ke maalik hain, to yahan apna paigham ya suraagh chorein.'
            : 'If you spotted this item, or are claiming ownership, leave a helpful tip or verification message below.'}
        </p>

        {/* Existing inquiries list */}
        {item.inquiries && item.inquiries.length > 0 ? (
          <div>
            {item.inquiries.map((inq) => (
              <div key={inq._id} className="inquiry-bubble">
                <div className="inquiry-header">
                  <span className="inquiry-author">
                    👤 {inq.name}
                    {inq.phone ? ` (${inq.phone})` : ''}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="inquiry-date">{formatDate(inq.createdAt, lang)}</span>
                    {(isOwner || (user && inq.user === user.id)) && (
                      <button
                        type="button"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--lost-red)', fontSize: '0.8rem' }}
                        onClick={() => deleteInquiry(inq._id)}
                        title="Delete inquiry"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
                <p className="inquiry-message">{inq.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-dim)', fontStyle: 'italic', margin: '0 0 20px' }}>
            {lang === 'ur' ? 'Abhi tak koi tip ya paigham nahi aaya.' : 'No tips or messages posted yet.'}
          </p>
        )}

        {/* Post inquiry form */}
        <form onSubmit={submitInquiry} style={{ marginTop: '20px', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
          <h3 style={{ margin: '0 0 14px', fontSize: '1.1rem' }}>{t.leaveTipBtn}</h3>
          <div className="form-row-2">
            <div className="form-field">
              <label className="form-label">{lang === 'ur' ? 'Aapka Naam' : 'Your Name'} *</label>
              <input
                className="form-input"
                required
                value={inqName}
                onChange={(e) => setInqName(e.target.value)}
                placeholder="Ahmed / Ali"
              />
            </div>
            <div className="form-field">
              <label className="form-label">{lang === 'ur' ? 'Rabta Number (Optional)' : 'Contact Number (Optional)'}</label>
              <input
                className="form-input"
                type="tel"
                value={inqPhone}
                onChange={(e) => setInqPhone(e.target.value)}
                placeholder="03XX XXXXXXX"
              />
            </div>
          </div>
          <div className="form-field">
            <label className="form-label">{lang === 'ur' ? 'Aapka Paigham / Tip' : 'Your Tip or Claim Note'} *</label>
            <textarea
              className="form-textarea"
              required
              rows={3}
              value={inqMsg}
              onChange={(e) => setInqMsg(e.target.value)}
              placeholder={lang === 'ur' ? 'Maine yeh cheez is jaga dekhi thi...' : 'I saw this item near...'}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={submittingInq}>
            {submittingInq ? 'Bhej rahe hain...' : (lang === 'ur' ? 'Paigham Post Karein' : 'Submit Tip')}
          </button>
        </form>
      </section>

      {/* Printable Flyer Modal */}
      {showFlyer && <FlyerModal item={item} onClose={() => setShowFlyer(false)} />}
    </>
  );
}
