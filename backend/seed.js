require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Item = require('./models/Item');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lostfound';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected for Seeding...');

    // Clean existing collections
    await User.deleteMany({});
    await Item.deleteMany({});
    console.log('Old data cleared.');

    const passwordHash = await bcrypt.hash('password123', 10);

    const user1 = await User.create({
      name: 'Ahmed Khan',
      email: 'ahmed@lostfound.pk',
      password: passwordHash,
      phone: '03001234567',
    });

    const user2 = await User.create({
      name: 'Fatima Noor',
      email: 'fatima@lostfound.pk',
      password: passwordHash,
      phone: '03219876543',
    });

    const user3 = await User.create({
      name: 'Hamza Ali',
      email: 'hamza@lostfound.pk',
      password: passwordHash,
      phone: '03335558888',
    });

    const items = [
      {
        user: user1._id,
        type: 'lost',
        title: 'Black Bi-Fold Leather Wallet (J. Junaid Jamshed)',
        description:
          'Kala leather wallet jo Saddar Metro Bus Station ticket counter ke qareeb gir gaya. Is mein mera original CNIC (Ahmed Khan), Islamabad traffic police driving license, aur HBL debit card tha. Khidmat-e-insaniyat ke jazbe ke tehat jo bhai lautaega uski bari meherbani hogi.',
        category: 'wallet',
        location: 'Saddar Metro Bus Station Counter 2',
        city: 'Rawalpindi',
        contactName: 'Ahmed Khan',
        contactPhone: '03001234567',
        whatsapp: '03001234567',
        brand: 'J. (Junaid Jamshed)',
        modelNumber: 'JJ-WL-2023-BK',
        color: 'Jet Black',
        condition: 'Used / Good',
        identifyingMarks: 'Embossed silver J. logo on corner, small stitching repair on coin pocket.',
        claimRequirement: 'Owner name Ahmed Khan verification via CNIC matching or driving license serial.',
        faqs: [
          {
            question: 'Kya wallet mein cash bhi tha?',
            answer: 'Cash se zyada zaroori mere governmental documents aur CNIC hain.',
          },
          {
            question: 'Rabta karne ka munasib waqt kya hai?',
            answer: 'Subah 9:00 baje se raat 10:00 baje tak kisi bhi waqt call ya WhatsApp kar sakte hain.',
          },
        ],
        status: 'open',
        views: 64,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        inquiries: [
          {
            user: user2._id,
            name: 'Fatima Noor',
            phone: '03219876543',
            message: 'Bhai metro security supervisor office mein pata karein, wahan kal kisi musafir ne wallet jama karwaya tha.',
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        ],
      },
      {
        user: user2._id,
        type: 'found',
        title: 'Honda CD 70 Ignition Key with Red Leather Strip & Padlock Key',
        description:
          'Honda CD 70 motorcycle ki chaabi mili hai jis ke sath red leather braided keychain aur ek chota brass padlock key laga hua hai. Gourmet bakery ke samnay passenger bench par pari thi. Asal maalik nishani bata kar wapas le sakte hain.',
        category: 'keys',
        location: 'Near Gourmet Bakers, Liberty Market',
        city: 'Lahore',
        contactName: 'Fatima Noor',
        contactPhone: '03219876543',
        whatsapp: '03219876543',
        brand: 'Honda Atlas',
        modelNumber: 'CD-70 Genuine',
        color: 'Silver key with Red/Black leather tag',
        condition: 'Used / Good',
        identifyingMarks: 'Small triangular scratch on the key head, brass lock key attached with silver ring.',
        claimRequirement: 'Owner must verify motorcycle registration or show bike ignition key shape.',
        faqs: [
          {
            question: 'Chaabi kahan se collect ki ja sakti hai?',
            answer: 'Liberty Market police help desk ya hamare qareebi clinic se office timing mein collect karein.',
          },
        ],
        status: 'open',
        views: 45,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        user: user3._id,
        type: 'lost',
        title: 'Apple iPhone 13 (128GB, Sierra Blue)',
        description:
          'Sierra Blue rang ka iPhone 13 khoya hai. Screen protector corner se thora cracked hai aur transparent matte silicon case laga hai. Lock screen wallpaper par orange cat ki tasweer hai. Bohat zaroori family aur university documents hain.',
        category: 'phone',
        location: 'Dolmen Mall Clifton, 2nd Floor Food Court',
        city: 'Karachi',
        contactName: 'Hamza Ali',
        contactPhone: '03335558888',
        whatsapp: '03335558888',
        brand: 'Apple',
        modelNumber: 'A2633 (iPhone 13)',
        color: 'Sierra Blue',
        condition: 'Like New',
        identifyingMarks: 'Slight screen protector crack at top right, transparent matte cover.',
        claimRequirement: 'IMEI box slip or Apple ID login verification upon handover.',
        faqs: [
          {
            question: 'Kya phone par Lost Mode active hai?',
            answer: 'Jee haan, Find My app se phone Lost Mode par hai aur contact number display ho raha hai.',
          },
        ],
        status: 'open',
        views: 112,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        user: user1._id,
        type: 'found',
        title: 'Pure White Persian Kitten with Golden Bell Collar',
        description:
          'Bohat pyari white Persian billi hamare ghar ke lawn mein aayi hai. Gale mein golden bell collar hai aur light blue strap laga hai. Bohat well-groomed aur friendly hai, lagta hai qareebi kisi ghar se nikli hai. Baraye insaniyat asal maalik rabta karein.',
        category: 'pet',
        location: 'Street 14, Sector F-8/2',
        city: 'Islamabad',
        contactName: 'Ahmed Khan',
        contactPhone: '03001234567',
        whatsapp: '03001234567',
        brand: 'Persian Breed',
        modelNumber: 'Domestic Pet',
        color: 'Pure White with Amber Eyes',
        condition: 'Like New',
        identifyingMarks: 'Golden bell on sky-blue collar, answer to name calls.',
        claimRequirement: 'Owner must show previous home photos of the pet or vaccination booklet.',
        faqs: [
          {
            question: 'Billi is waqt kahan hai?',
            answer: 'Hamare ghar mein safe aur well-fed hai, indoor secure rakha gaya hai.',
          },
        ],
        status: 'open',
        views: 88,
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        user: user2._id,
        type: 'lost',
        title: 'Dell Pro 15.6 Inch Laptop Backpack with Degree Documents',
        description:
          'Grey water-resistant Dell backpack jis mein original BSc Electrical Engineering degree, transcript file aur Dell 65W charger hai. University road bus stop par bhool gaye thay.',
        category: 'bag',
        location: 'University Road near Fast NUCES Gate 1',
        city: 'Peshawar',
        contactName: 'Fatima Noor',
        contactPhone: '03219876543',
        whatsapp: '03219876543',
        brand: 'Dell Official',
        modelNumber: 'Dell Pro Backpack 15 - PO1520P',
        color: 'Heather Grey',
        condition: 'Used / Good',
        identifyingMarks: 'Blue keychain hook on left zipper, university ID card in front pocket.',
        claimRequirement: 'Matching student ID card and degree name verification.',
        faqs: [
          {
            question: 'Kya bag mein laptop bhi tha?',
            answer: 'Nahi, sirf original educational certificates, transcripts aur diary thi.',
          },
        ],
        status: 'open',
        views: 79,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        user: user3._id,
        type: 'found',
        title: 'Official NADRA Smart National Identity Card (CNIC)',
        description:
          'HBL ATM machine ke counter se Muhammad Rizwan naam ka chip wala smart CNIC card mila hai. Baraye khidmat-e-khalq asal maalik father name aur address verify kar ke le ja sakte hain.',
        category: 'documents',
        location: 'HBL ATM Booth near Clock Tower',
        city: 'Faisalabad',
        contactName: 'Hamza Ali',
        contactPhone: '03335558888',
        whatsapp: '03335558888',
        brand: 'Government of Pakistan / NADRA',
        modelNumber: 'Smart National ID',
        color: 'Greenish Smart Chip Card',
        condition: 'Like New',
        identifyingMarks: 'Chip intact, valid till 2031.',
        claimRequirement: 'Must verify Father Name and Date of Birth on record.',
        faqs: [
          {
            question: 'Kya card branch mein submit karwa diya gaya hai?',
            answer: 'Jee branch manager ko ittila de di gayi hai, verify karwa kar hand over kiya jayega.',
          },
        ],
        status: 'open',
        views: 32,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        user: user1._id,
        type: 'lost',
        title: 'Casio Edifice Chronograph Stainless Steel Watch',
        description:
          'Silver steel chain wali Casio Edifice watch gym locker bench par reh gayi thi. Honest security guard ne pehchan verify kar ke wapas kar di. Alhamdulillah!',
        category: 'jewellery',
        location: 'Shapes Gym, Gulberg III',
        city: 'Lahore',
        contactName: 'Ahmed Khan',
        contactPhone: '03001234567',
        whatsapp: '03001234567',
        brand: 'Casio Edifice',
        modelNumber: 'EFV-550D-1AVUDF',
        color: 'Silver Steel with Black Dial',
        condition: 'Used / Good',
        identifyingMarks: 'Sub-dial chronograph, safety clasp lock.',
        claimRequirement: 'Verified and returned successfully.',
        status: 'resolved',
        resolvedDate: new Date(),
        views: 140,
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      },
    ];

    await Item.insertMany(items);
    console.log(`Seeding complete! Added 3 users and ${items.length} items with real specifications.`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
