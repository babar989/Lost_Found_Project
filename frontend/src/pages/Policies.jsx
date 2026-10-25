import useSEO from '../hooks/useSEO';
import { useLang } from '../context/LanguageContext';

export default function Policies() {
  const { lang } = useLang();

  useSEO(
    lang === 'ur' ? 'Policies & Community Guidelines' : 'Policies & Safety Guidelines',
    'Lost & Found Portal — Mehfooz wapsi, verification rules, privacy policy aur community code of conduct.'
  );

  return (
    <article className="detail-card" style={{ maxWidth: '860px', margin: '0 auto', lineHeight: 1.8 }}>
      <header style={{ marginBottom: '28px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '18px' }}>
        <h1 style={{ fontSize: '2.4rem', margin: '0 0 10px' }}>
          {lang === 'ur' ? 'Community Policies & Safe Guidelines' : 'Community Policies & Guidelines'}
        </h1>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>
          {lang === 'ur'
            ? 'Amanatdari, shafafiyat aur shehriyon ki hifazat ke liye tayyar karda qawaneen.'
            : 'Operational standards, privacy commitments, and safe exchange guidelines.'}
        </p>
      </header>

      <section style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--brand-blue)' }}>
          1. Verification &amp; Handover Policy (Malkiat Ki Tauseeq)
        </h2>
        <p>
          Kisi bhi khoyi hui cheez ko uske daawedari (claimant) ke hawalay karne se pehle darj zail usoolon par amal zaroori hai:
        </p>
        <ul style={{ paddingLeft: '20px' }}>
          <li><strong>Document Matching:</strong> Agar wallet ya documents hain to claim karne wale ka CNIC, driving license ya photo ID original record se match hona chahiye.</li>
          <li><strong>Electronic Devices (Phones / Laptops):</strong> Phone unlock kar ke dikhana, unique lock-screen wallpaper batana, ya purchase box ka IMEI match karwana zaroori hai.</li>
          <li><strong>Keys &amp; Vehicles:</strong> Spare key se lock open karwana ya vehicle registration book / card dikhana lazmi hai.</li>
          <li><strong>Pets (Paltu Janwar):</strong> Pet ki purani tasweerein ya vaccination card dikhana zaroori hai.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--brand-blue)' }}>
          2. Safe Meeting Protocols (Mulaqaat Ki Hifazat)
        </h2>
        <ul style={{ paddingLeft: '20px' }}>
          <li>Hamesha public aur roshan jagah par din ke waqt mulaqaat karein (jaise Metro station premises, commercial bank branches, shopping mall customer counters ya police khidmat markaz).</li>
          <li>Kabhi kisi ko sunsan jagah ya niji ghar par akele na bulayein.</li>
          <li>Cheez ki wapsi par dono afraad apas mein salam aur duayein dein; kisi qisam ka jhagda ya shak ho to foran qareebi security staff se rabta karein.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--brand-blue)' }}>
          3. Privacy &amp; Data Protection (Personal Data Ki Hifazat)
        </h2>
        <p>
          Hamara maqsad shehriyon ki khidmat hai, na ke unke data ki tijarat:
        </p>
        <ul style={{ paddingLeft: '20px' }}>
          <li>Hum kisi bhi user ka phone number, email ya data kisi commercial marketing company ko farokht nahi karte.</li>
          <li>Post resolve hone ke baad user apni post ko kisi bhi waqt delete kar sakta hai, jis se uski tasweer aur phone number portal se foran remove ho jatay hain.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--brand-blue)' }}>
          4. Non-Commercial &amp; Humanitarian Disclaimer
        </h2>
        <p>
          Yeh portal mukammal tor par insaniyat aur amanatdari ke jazbay par qaim hai. Yeh koi commercial store ya munafa-bakhsh idara nahi hai. Tamam shehri az-khud naik niyyati se doosray musafir ya shehri ki cheez lautane mein hissa letay hain.
        </p>
      </section>
    </article>
  );
}
