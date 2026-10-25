import { Link, NavLink, useNavigate } from 'react-router-dom';
import BrandLogo from './BrandLogo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useLang } from '../context/LanguageContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();
  const { showToast } = useToast();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    showToast(lang === 'ur' ? 'Aap logout ho chuke hain' : 'Logged out successfully', 'info');
    nav('/');
  };

  return (
    <header className="navbar-root">
      <div className="wrap navbar-inner">
        <Link to="/" aria-label="Lost and Found Home" style={{ textDecoration: 'none' }}>
          <BrandLogo size={40} />
        </Link>

        <nav className="nav-actions" aria-label="Main Navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link-btn ${isActive ? 'active' : ''}`}
          >
            {t.navAll}
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) => `nav-link-btn ${isActive ? 'active' : ''}`}
          >
            {lang === 'ur' ? 'Hamare Mutalliq' : 'About'}
          </NavLink>

          <NavLink
            to="/faqs"
            className={({ isActive }) => `nav-link-btn ${isActive ? 'active' : ''}`}
          >
            FAQs
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) => `nav-link-btn ${isActive ? 'active' : ''}`}
          >
            {lang === 'ur' ? 'Rabta' : 'Contact'}
          </NavLink>

          {user && (
            <NavLink
              to="/mine"
              className={({ isActive }) => `nav-link-btn ${isActive ? 'active' : ''}`}
            >
              {t.navMine}
            </NavLink>
          )}

          <Link to="/post" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
            {t.navPost}
          </Link>

          {/* Language Toggle */}
          <button
            type="button"
            className="lang-toggle-btn"
            onClick={toggleLang}
            title={lang === 'ur' ? 'Switch to English' : 'Urdu mein dekhein'}
          >
            🌐 {lang === 'ur' ? 'English' : 'اردو'}
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* User Menu */}
          {user ? (
            <div className="user-menu-pill">
              <span className="user-avatar-circle">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
              <span>{user.name}</span>
              <button
                type="button"
                className="btn-outline"
                style={{ padding: '4px 8px', fontSize: '0.8rem', border: 'none' }}
                onClick={handleLogout}
              >
                {t.navLogout}
              </button>
            </div>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => `nav-link-btn ${isActive ? 'active' : ''}`}
              >
                {t.navLogin}
              </NavLink>
              <Link
                to="/register"
                className="btn-outline"
                style={{ padding: '8px 14px', fontSize: '0.88rem' }}
              >
                {t.navRegister}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
