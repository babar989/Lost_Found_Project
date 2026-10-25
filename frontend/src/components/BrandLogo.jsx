export default function BrandLogo({ size = 36 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <rect width="48" height="48" rx="12" fill="#1e3a8a" />
        {/* Search lens circle */}
        <circle cx="21" cy="21" r="11" stroke="#38bdf8" strokeWidth="3" />
        <line x1="29.5" y1="29.5" x2="40" y2="40" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
        {/* Community handshake symbol inside lens */}
        <path
          d="M16 23C17 21 19 21 21 23C23 21 25 21 26 23"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="21" cy="16" r="2" fill="#f59e0b" />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 800,
          fontSize: '1.25rem',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          color: 'var(--text-main)',
        }}>
          Lost &amp; Found
        </span>
        <span style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: '#3b82f6',
        }}>
          Khidmat-e-Insaniyat
        </span>
      </div>
    </div>
  );
}
