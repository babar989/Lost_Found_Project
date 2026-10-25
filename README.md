# 🔍 Lost & Found — MERN Stack Community Portal

Pakistan aur qareebi mohallon / shehron ki khoyi hui aur mili hui cheezon ko talash karne aur wapas unke asal maalik tak pohnchane ka mukammal, modern aur responsive MERN Stack web portal.

Is project mein **Frontend** aur **Backend** dono alag alag folders mein structured hain:
- 📂 `frontend/` (React + Vite + Modern Vanilla CSS Design System)
- 📂 `backend/` (Node.js + Express + MongoDB + JWT + Multer)

---

## 🌟 Key Features

### 1. 🎨 Modern Design & UI Experience
- **Dark & Light Mode**: User ki pasand ke mutabiq smooth dark/light theme switch jo refresh ke baad bhi save rehta hai.
- **Bilingual Interface**: **Roman Urdu** aur **English** mein 1-click toggle (`🌐 English` / `🌐 اردو`).
- **Rich Aesthetics**: Glassmorphism, tailored gradients, Outfit & Plus Jakarta Sans typography, card hover animations aur clean badges.
- **Responsive Layout**: Mobile, tablet aur desktop sab devices ke liye fully responsive.

### 2. ⚡ Discovery & Smart Filtering
- **Live Search**: Title, description, aur specific location par instant search.
- **Type Toggle**: All, Khoya Hai (Lost), Mila Hai (Found).
- **Category Filter**: Phone, Wallet, Bag, Keys, Documents/CNIC, Electronics, Pets, Jewellery, Vehicles, Clothing, etc.
- **City Selector**: Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, Faisalabad, Multan, Quetta, waghera.
- **Sort Modes**: Taza tareen (Newest), Zyada dekhi gayi (Views), Purani pehle.
- **View Modes**: Grid View aur Compact List View switcher.

### 3. 📄 Printable "Gumshuda Talash" Flyer (Poster)
- Har post ka ek standard printable missing flyer modal jo **A4 print** ya **PDF save** ke liye tayyar rehta hai (`window.print()`).
- Is mein bold headline, tasweer, category, jagah aur baraye rabta box shamil hai (100% Free Community Service).

### 4. 💬 Quick Community Actions
- **Direct WhatsApp Chat**: 1-click WhatsApp chat link with prefilled respectful greeting and item title.
- **Phone Call**: Direct click-to-call link.
- **Share Link**: Link copy karne par instant animated toast notification.
- **Community Leads & Inquiries**: Post par log suraagh (leads) ya tips chor sakte hain taake maalik tak information pohnch sake.

### 5. 🔐 User Account & Management
- JWT Authentication (Register / Login).
- **1-Click Demo Accounts**: Test karne ke liye Login page par Ahmed Khan, Fatima Noor, aur Hamza Ali ke demo credentials buttons.
- **Meri Posts (Dashboard)**: Apni posts dekhna, status tabdeel karna ("Wapas Mil Gayi / Reunited"), edit karna aur delete karna.
- **Post Editing**: Post ka naam, nishaniyan, shehar, jagah, rabta number aur photo update karne ki poori suvidha.

---

## 🛠️ Project Structure

```text
lost-found-mern/
├── backend/                  # Express + Node.js + MongoDB API
│   ├── middleware/           # JWT auth middleware
│   ├── models/               # User & Item Mongoose schemas
│   ├── routes/               # /api/auth & /api/items routes
│   ├── uploads/              # Uploaded item photos
│   ├── .env                  # Port, Mongo URI, JWT secret
│   ├── seed.js               # Sample data generator
│   ├── server.js             # Entry point
│   └── package.json
│
├── frontend/                 # React 18 + Vite UI
│   ├── src/
│   │   ├── components/       # Navbar, ItemCard, StatsBanner, FlyerModal
│   │   ├── context/          # Auth, Theme, Language, Toast contexts
│   │   ├── pages/            # Home, ItemDetail, PostItem, EditItem, MyPosts, Login, Register
│   │   ├── api.js            # Axios client with bearer token interceptor
│   │   ├── App.jsx           # App routes
│   │   ├── main.jsx          # Providers & Root render
│   │   └── styles.css        # Modern design system & themes
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── package.json              # Root orchestrator (runs both together)
└── README.md
```

---

## 🚀 Chalane Ka Tareeqa (Quick Start)

### 1. Dono Ko Aik Sath Chalana (Recommended):
Root directory mein rehtay hue:

```bash
npm run dev
```

Yeh single command:
- Backend ko `http://localhost:5000` par run karegi.
- Frontend ko `http://localhost:5173` par run karegi.

---

### 2. Alag Alag Chalana:

#### Backend:
```bash
cd backend
npm run dev
```
*(Backend port 5000 par chalega)*

#### Frontend:
```bash
cd frontend
npm run dev
```
*(Frontend port 5173 par chalega)*

---

### 3. Demo Data Reset / Seed Script:
```bash
npm run seed
```
*(Ya `cd backend && node seed.js`)*

---

## 👤 Test Demo Accounts

| Name | Email | Password |
|---|---|---|
| Ahmed Khan | `ahmed@lostfound.pk` | `password123` |
| Fatima Noor | `fatima@lostfound.pk` | `password123` |
| Hamza Ali | `hamza@lostfound.pk` | `password123` |

*(Aap Login page par maujood quick-fill buttons par click kar ke bhi bina type kiye foran login kar sakte hain).*
