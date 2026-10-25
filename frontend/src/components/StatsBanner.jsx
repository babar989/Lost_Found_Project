import { useEffect, useState } from 'react';
import api from '../api';
import { useLang } from '../context/LanguageContext.jsx';

export default function StatsBanner() {
  const { lang, t } = useLang();
  const [stats, setStats] = useState({
    total: 0,
    lost: 0,
    found: 0,
    resolved: 0,
  });

  useEffect(() => {
    api
      .get('/items/stats')
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon lost">🔍</div>
        <div>
          <div className="stat-num">{stats.lost}</div>
          <div className="stat-label">{t.statLost}</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon found">🎁</div>
        <div>
          <div className="stat-num">{stats.found}</div>
          <div className="stat-label">{t.statFound}</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon resolved">🎉</div>
        <div>
          <div className="stat-num">{stats.resolved}</div>
          <div className="stat-label">{t.statResolved}</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
          🤝
        </div>
        <div>
          <div className="stat-num" style={{ fontSize: '1.25rem', color: '#10b981' }}>
            {lang === 'ur' ? '100% Muft' : '100% Free'}
          </div>
          <div className="stat-label">{t.statFree}</div>
        </div>
      </div>
    </div>
  );
}
