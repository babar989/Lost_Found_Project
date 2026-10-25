import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Policies from './pages/Policies.jsx';
import Faqs from './pages/Faqs.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import PostItem from './pages/PostItem.jsx';
import EditItem from './pages/EditItem.jsx';
import ItemDetail from './pages/ItemDetail.jsx';
import MyPosts from './pages/MyPosts.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { useLang } from './context/LanguageContext.jsx';

function Private({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export default function App() {
  const { lang } = useLang();

  return (
    <div className="app-container">
      <Navbar />
      <main className="wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/item/:id" element={<ItemDetail />} />
          <Route
            path="/edit/:id"
            element={
              <Private>
                <EditItem />
              </Private>
            }
          />
          <Route
            path="/post"
            element={
              <Private>
                <PostItem />
              </Private>
            }
          />
          <Route
            path="/mine"
            element={
              <Private>
                <MyPosts />
              </Private>
            }
          />
          <Route
            path="*"
            element={
              <div className="detail-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                <span style={{ fontSize: '3rem' }}>🔍</span>
                <h2>404 — {lang === 'ur' ? 'Page Nahi Mila' : 'Page Not Found'}</h2>
                <p style={{ color: 'var(--text-muted)' }}>
                  {lang === 'ur'
                    ? 'Aap jis page par aana chah rahe thay woh maujood nahi hai.'
                    : 'The page you are looking for does not exist.'}
                </p>
                <Link to="/" className="btn-primary" style={{ marginTop: '14px', display: 'inline-block' }}>
                  {lang === 'ur' ? 'Home Par Wapas Jayein' : 'Return to Home'}
                </Link>
              </div>
            }
          />
        </Routes>
      </main>

      {/* Professional Footer */}
      <footer style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '36px 20px 24px',
        color: 'var(--text-muted)',
        fontSize: '0.9rem',
      }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '28px', marginBottom: '28px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '8px' }}>
              Lost &amp; Found Pakistan
            </div>
            <p style={{ margin: 0, fontSize: '0.86rem', lineHeight: 1.6 }}>
              Khidmat-e-insaniyat aur community solidarity ke tehat shehriyon ki khoyi aur mili hui amanaat ko unke asal malkan tak pohnchane ka digital platform.
            </p>
          </div>

          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px' }}>
              Quick Navigation
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.86rem' }}>
              <Link to="/">Sab Cheezein (Directory)</Link>
              <Link to="/about">Hamare Mutalliq (About)</Link>
              <Link to="/faqs">Aksar Poochay Gaye Sawalat (FAQs)</Link>
              <Link to="/contact">Rabta Support (Helpdesk)</Link>
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px' }}>
              Safe Guidelines &amp; Policies
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.86rem' }}>
              <Link to="/policies">Verification &amp; Handover Protocol</Link>
              <Link to="/policies">Data Privacy Commitment</Link>
              <Link to="/policies">Community Code of Conduct</Link>
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px' }}>
              Support &amp; Desk
            </div>
            <div style={{ fontSize: '0.86rem', lineHeight: 1.6 }}>
              <div>Email: support@lostfound.pk</div>
              <div>Helpline: +92 (051) 8899770</div>
              <div>Islamabad Community Hub</div>
            </div>
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '18px',
          fontSize: '0.8rem',
          color: 'var(--text-dim)',
        }}>
          Lost &amp; Found Portal · Dedicated to Humanity &amp; Community Service · Emergency Assistance: Call 15
        </div>
      </footer>
    </div>
  );
}
