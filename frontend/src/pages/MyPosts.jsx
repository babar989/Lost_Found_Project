import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../api';
import ItemCard from '../components/ItemCard.jsx';
import { useLang } from '../context/LanguageContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function MyPosts() {
  const { lang, t } = useLang();
  const { showToast } = useToast();

  const [items, setItems] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'open', 'resolved'
  const [error, setError] = useState('');

  const fetchMine = () => {
    api
      .get('/items/mine')
      .then((r) => setItems(r.data))
      .catch((e) => setError(errMsg(e)));
  };

  useEffect(() => {
    fetchMine();
  }, []);

  const toggleResolved = async (id) => {
    try {
      const { data } = await api.put(`/items/${id}/resolve`);
      setItems(items.map((i) => (i._id === id ? data : i)));
      showToast(
        data.status === 'resolved'
          ? (lang === 'ur' ? 'Mubarak! Cheez wapas mil gayi mark ho gayi.' : 'Item marked as Reunited!')
          : (lang === 'ur' ? 'Post dobara open ho gayi.' : 'Item reopened.'),
        'success'
      );
    } catch (e) {
      showToast(errMsg(e), 'error');
    }
  };

  const removePost = async (id) => {
    if (
      !window.confirm(
        lang === 'ur'
          ? 'Kya aap sach mein ye post delete karna chahte hain?'
          : 'Are you sure you want to delete this post?'
      )
    ) {
      return;
    }
    try {
      await api.delete(`/items/${id}`);
      setItems(items.filter((i) => i._id !== id));
      showToast(lang === 'ur' ? 'Post delete ho gayi' : 'Post deleted successfully', 'success');
    } catch (e) {
      showToast(errMsg(e), 'error');
    }
  };

  if (error) return <p className="error">{error}</p>;

  if (!items) {
    return (
      <div className="detail-card" style={{ textAlign: 'center', padding: '60px' }}>
        <p className="empty">{t.loadingMsg}</p>
      </div>
    );
  }

  const filteredItems = items.filter((it) => {
    if (filter === 'open') return it.status === 'open';
    if (filter === 'resolved') return it.status === 'resolved';
    return true;
  });

  const totalViews = items.reduce((acc, it) => acc + (it.views || 0), 0);
  const totalInquiries = items.reduce((acc, it) => acc + (it.inquiries?.length || 0), 0);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', margin: '0 0 6px' }}>{t.navMine}</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>
            {lang === 'ur'
              ? 'Aapki banai hui tamam lost aur found posts.'
              : 'Manage and update all your reported items.'}
          </p>
        </div>
        <Link to="/post" className="btn-primary">
          {t.navPost}
        </Link>
      </div>

      {/* Summary Bar */}
      <div className="stats-grid" style={{ marginBottom: '28px' }}>
        <div className="stat-card">
          <div className="stat-icon lost">📝</div>
          <div>
            <div className="stat-num">{items.length}</div>
            <div className="stat-label">{lang === 'ur' ? 'Kul Posts' : 'Total Posts'}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon found">👁️</div>
          <div>
            <div className="stat-num">{totalViews}</div>
            <div className="stat-label">{lang === 'ur' ? 'Total Views' : 'Total Views'}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon resolved">💬</div>
          <div>
            <div className="stat-num">{totalInquiries}</div>
            <div className="stat-label">{lang === 'ur' ? 'Paighamat / Tips' : 'Tips Received'}</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="segmented-control" style={{ marginBottom: '20px' }}>
        <button
          type="button"
          className={`segment-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          {lang === 'ur' ? `Sab (${items.length})` : `All (${items.length})`}
        </button>
        <button
          type="button"
          className={`segment-btn ${filter === 'open' ? 'active' : ''}`}
          onClick={() => setFilter('open')}
        >
          {lang === 'ur'
            ? `Active / Khoyi (${items.filter((i) => i.status === 'open').length})`
            : `Active (${items.filter((i) => i.status === 'open').length})`}
        </button>
        <button
          type="button"
          className={`segment-btn ${filter === 'resolved' ? 'active' : ''}`}
          onClick={() => setFilter('resolved')}
        >
          {lang === 'ur'
            ? `Wapas Mil Gayi (${items.filter((i) => i.status === 'resolved').length})`
            : `Reunited (${items.filter((i) => i.status === 'resolved').length})`}
        </button>
      </div>

      {filteredItems.length === 0 ? (
        <div className="detail-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📭</div>
          <p className="empty" style={{ fontSize: '1.1rem' }}>
            {lang === 'ur' ? 'Aap ne abhi tak koi post nahi ki.' : 'You have not reported any items in this category.'}
          </p>
          <Link to="/post" className="btn-primary" style={{ marginTop: '14px' }}>
            {t.navPost}
          </Link>
        </div>
      ) : (
        <section className="items-grid">
          {filteredItems.map((it) => (
            <ItemCard key={it._id} item={it}>
              {/* Owner Action Buttons Row */}
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <button
                  type="button"
                  className={it.status === 'open' ? 'btn-primary' : 'btn-outline'}
                  style={{ flex: 2, padding: '7px 10px', fontSize: '0.82rem' }}
                  onClick={() => toggleResolved(it._id)}
                >
                  {it.status === 'open'
                    ? (lang === 'ur' ? '✓ Mil Gayi' : '✓ Reunited')
                    : (lang === 'ur' ? 'Dobara Open' : 'Reopen')}
                </button>

                <Link
                  to={`/edit/${it._id}`}
                  className="btn-outline"
                  style={{ padding: '7px 10px', fontSize: '0.82rem' }}
                  title="Edit post"
                >
                  ✏️
                </Link>

                <button
                  type="button"
                  className="btn-danger-outline"
                  style={{ padding: '7px 10px', fontSize: '0.82rem' }}
                  onClick={() => removePost(it._id)}
                  title="Delete post"
                >
                  🗑️
                </button>
              </div>
            </ItemCard>
          ))}
        </section>
      )}
    </>
  );
}
