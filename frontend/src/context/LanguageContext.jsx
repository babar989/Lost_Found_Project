import { createContext, useContext, useState } from 'react';

const translations = {
  ur: {
    brandName: 'Lost & Found',
    brandSub: 'Community Portal',
    navAll: 'Sab Cheezein',
    navMine: 'Meri Posts',
    navPost: '+ Cheez Post Karein',
    navLogin: 'Login',
    navRegister: 'Account Banayein',
    navLogout: 'Logout',
    heroTag: '🇵🇰 100% Muft Community Service',
    heroTitle: 'Kuch Kho Gaya? Ya Kuch Mila?',
    heroSubtitle: 'Apne mohalle aur shehar ki khoyi ya mili hui cheezein talash karein, ya foran report karein taake asal maalik tak pohnch sakein.',
    reportLostBtn: '🔍 Khoyi Hui Cheez Likhein',
    reportFoundBtn: '🎁 Mili Hui Cheez Likhein',
    statTotal: 'Kul Reports',
    statLost: 'Khoyi Hui Cheezein',
    statFound: 'Mili Hui Cheezein',
    statResolved: 'Wapas Mil Gayi',
    statFree: '100% Muft Khidmat',
    searchPlaceholder: 'Cheez ka naam, nishani ya jagah likhein (jaise: wallet, CD 70, Clifton)...',
    filterAll: 'Sab',
    filterLost: 'Khoya Hai',
    filterFound: 'Mila Hai',
    filterResolved: 'Wapas Mil Gayi',
    categoryAll: 'Tamam Categories',
    cityAll: 'Tamam Shehar',
    sortNewest: 'Taza Tareen',
    sortViews: 'Zyada Dekhi Gayi',
    contactOwner: 'Maalik Se Rabta Karein',
    chatWhatsapp: 'WhatsApp Chat',
    callNow: 'Call Karein',
    generateFlyer: '📄 Gumshuda Talash Poster',
    sharePost: 'Link Copy Karein',
    inquiriesTitle: 'Tafseelat & Verification Tips',
    leaveTipBtn: 'Tip Ya Lead Dein',
    emptyMsg: 'Koi cheez nahi mili. Filters tabdeel karein ya naya record post karein.',
    loadingMsg: 'Load ho raha hai...',
  },
  en: {
    brandName: 'Lost & Found',
    brandSub: 'Community Hub',
    navAll: 'All Items',
    navMine: 'My Posts',
    navPost: '+ Post an Item',
    navLogin: 'Log In',
    navRegister: 'Register',
    navLogout: 'Log Out',
    heroTag: '🇵🇰 100% Free Community Service',
    heroTitle: 'Lost Something? Or Found Something?',
    heroSubtitle: 'Search, report, and reunite lost or found items across your city and neighborhood safely, easily and completely free.',
    reportLostBtn: '🔍 Report Lost Item',
    reportFoundBtn: '🎁 Report Found Item',
    statTotal: 'Total Reports',
    statLost: 'Lost Items',
    statFound: 'Found Items',
    statResolved: 'Reunited',
    statFree: '100% Free Service',
    searchPlaceholder: 'Search by title, description or location (e.g. wallet, keys, Clifton)...',
    filterAll: 'All',
    filterLost: 'Lost',
    filterFound: 'Found',
    filterResolved: 'Reunited',
    categoryAll: 'All Categories',
    cityAll: 'All Cities',
    sortNewest: 'Newest First',
    sortViews: 'Most Viewed',
    contactOwner: 'Contact Reporter',
    chatWhatsapp: 'WhatsApp Chat',
    callNow: 'Call Now',
    generateFlyer: '📄 Print Missing Flyer',
    sharePost: 'Copy Share Link',
    inquiriesTitle: 'Inquiries & Community Tips',
    leaveTipBtn: 'Leave a Tip or Claim',
    emptyMsg: 'No items found matching your criteria. Try adjusting filters or be the first to post!',
    loadingMsg: 'Loading items...',
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('app_lang') || 'ur');

  const toggleLang = () => {
    const next = lang === 'ur' ? 'en' : 'ur';
    setLang(next);
    localStorage.setItem('app_lang', next);
  };

  const t = translations[lang] || translations.ur;

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
