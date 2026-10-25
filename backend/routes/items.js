const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const auth = require('../middleware/auth');
const Item = require('../models/Item');

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per file
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|png|webp|jpg)$/i.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Sirf JPG, PNG ya WEBP photo upload karein'));
    }
  },
});

const removeImages = (filenames) => {
  if (!filenames) return;
  const list = Array.isArray(filenames) ? filenames : [filenames];
  list.forEach((filename) => {
    if (!filename) return;
    const filePath = path.join(uploadsDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, () => {});
    }
  });
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ---- Platform Stats: GET /api/items/stats ----
router.get('/stats', async (req, res) => {
  try {
    const total = await Item.countDocuments();
    const lost = await Item.countDocuments({ type: 'lost', status: 'open' });
    const found = await Item.countDocuments({ type: 'found', status: 'open' });
    const resolved = await Item.countDocuments({ status: 'resolved' });

    res.json({
      total,
      lost,
      found,
      resolved,
    });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// ---- Public Items List: GET /api/items ----
router.get('/', async (req, res) => {
  try {
    const { type, category, city, q, status, sort } = req.query;
    const filter = {};

    // Status filter
    if (status === 'all') {
      // no status filter
    } else if (status === 'resolved') {
      filter.status = 'resolved';
    } else {
      filter.status = 'open';
    }

    if (type === 'lost' || type === 'found') {
      filter.type = type;
    }

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (city && city !== 'all') {
      filter.city = new RegExp(`^${escapeRegex(city)}$`, 'i');
    }

    if (q && q.trim()) {
      const rx = new RegExp(escapeRegex(q.trim()), 'i');
      filter.$or = [
        { title: rx },
        { description: rx },
        { location: rx },
        { city: rx },
        { brand: rx },
        { modelNumber: rx },
      ];
    }

    // Sort order
    let sortObj = { createdAt: -1 };
    if (sort === 'oldest') {
      sortObj = { createdAt: 1 };
    } else if (sort === 'views') {
      sortObj = { views: -1, createdAt: -1 };
    }

    const items = await Item.find(filter)
      .populate('user', 'name email phone')
      .sort(sortObj)
      .limit(100);

    res.json(items);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// ---- My Items: GET /api/items/mine ----
router.get('/mine', auth, async (req, res) => {
  try {
    const items = await Item.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// ---- Single Item: GET /api/items/:id ----
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('inquiries.user', 'name');

    if (!item) return res.status(404).json({ msg: 'Cheez nahi mili' });

    // Increment view count asynchronously
    Item.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }).exec();

    res.json(item);
  } catch (e) {
    res.status(404).json({ msg: 'Cheez nahi mili' });
  }
});

// ---- Create Item: POST /api/items ----
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      category,
      location,
      city,
      date,
      contactName,
      contactPhone,
      whatsapp,
      brand,
      modelNumber,
      color,
      condition,
      identifyingMarks,
      claimRequirement,
      faqs,
    } = req.body;

    if (!type || !title || !location || !contactPhone) {
      if (req.files && req.files.length) {
        removeImages(req.files.map((f) => f.filename));
      }
      return res.status(400).json({ msg: 'Type, cheez ka naam, jagah aur rabta number lazmi hain' });
    }

    const uploadedFiles = req.files ? req.files.map((f) => f.filename) : [];
    let parsedFaqs = [];
    if (faqs) {
      try {
        parsedFaqs = typeof faqs === 'string' ? JSON.parse(faqs) : faqs;
      } catch {}
    }

    const item = await Item.create({
      user: req.userId,
      type,
      title,
      description: description || '',
      category: category || 'other',
      location,
      city: city || '',
      date: date ? new Date(date) : new Date(),
      contactName: contactName || '',
      contactPhone,
      whatsapp: whatsapp || '',
      image: uploadedFiles[0] || '',
      images: uploadedFiles,
      brand: brand || '',
      modelNumber: modelNumber || '',
      color: color || '',
      condition: condition || 'Used / Good',
      identifyingMarks: identifyingMarks || '',
      claimRequirement: claimRequirement || '',
      faqs: parsedFaqs,
      status: 'open',
    });

    const populated = await Item.findById(item._id).populate('user', 'name email phone');
    res.status(201).json(populated);
  } catch (e) {
    if (req.files && req.files.length) {
      removeImages(req.files.map((f) => f.filename));
    }
    res.status(400).json({ msg: e.message });
  }
});

// ---- Update Item: PUT /api/items/:id ----
router.put('/:id', auth, upload.array('images', 5), async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, user: req.userId });
    if (!item) {
      if (req.files && req.files.length) {
        removeImages(req.files.map((f) => f.filename));
      }
      return res.status(404).json({ msg: 'Item nahi mila ya aap is ke owner nahi hain' });
    }

    const {
      type,
      title,
      description,
      category,
      location,
      city,
      date,
      contactName,
      contactPhone,
      whatsapp,
      brand,
      modelNumber,
      color,
      condition,
      identifyingMarks,
      claimRequirement,
      faqs,
    } = req.body;

    if (type) item.type = type;
    if (title) item.title = title;
    if (description !== undefined) item.description = description;
    if (category) item.category = category;
    if (location) item.location = location;
    if (city !== undefined) item.city = city;
    if (date) item.date = new Date(date);
    if (contactName !== undefined) item.contactName = contactName;
    if (contactPhone) item.contactPhone = contactPhone;
    if (whatsapp !== undefined) item.whatsapp = whatsapp;
    if (brand !== undefined) item.brand = brand;
    if (modelNumber !== undefined) item.modelNumber = modelNumber;
    if (color !== undefined) item.color = color;
    if (condition !== undefined) item.condition = condition;
    if (identifyingMarks !== undefined) item.identifyingMarks = identifyingMarks;
    if (claimRequirement !== undefined) item.claimRequirement = claimRequirement;

    if (faqs !== undefined) {
      try {
        item.faqs = typeof faqs === 'string' ? JSON.parse(faqs) : faqs;
      } catch {}
    }

    if (req.files && req.files.length > 0) {
      // Remove old images
      removeImages(item.images);
      if (item.image) removeImages(item.image);

      const newFiles = req.files.map((f) => f.filename);
      item.images = newFiles;
      item.image = newFiles[0] || '';
    }

    await item.save();
    const updated = await Item.findById(item._id).populate('user', 'name email phone');
    res.json(updated);
  } catch (e) {
    if (req.files && req.files.length) {
      removeImages(req.files.map((f) => f.filename));
    }
    res.status(400).json({ msg: e.message });
  }
});

// ---- Toggle Resolve / Reunited: PUT /api/items/:id/resolve ----
router.put('/:id/resolve', auth, async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, user: req.userId });
    if (!item) return res.status(404).json({ msg: 'Item nahi mila' });

    if (item.status === 'open') {
      item.status = 'resolved';
      item.resolvedDate = new Date();
    } else {
      item.status = 'open';
      item.resolvedDate = null;
    }

    await item.save();
    res.json(item);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// ---- Delete Item: DELETE /api/items/:id ----
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!item) return res.status(404).json({ msg: 'Item nahi mila' });

    removeImages(item.images);
    if (item.image) removeImages(item.image);

    res.json({ msg: 'Item kamyabi se delete ho gaya' });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// ---- Post Inquiry / Lead: POST /api/items/:id/inquiries ----
router.post('/:id/inquiries', async (req, res) => {
  try {
    const { name, phone, message } = req.body;
    if (!name || !message) {
      return res.status(400).json({ msg: 'Naam aur paigham lazmi hain' });
    }

    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: 'Item nahi mila' });

    let userId = null;
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        userId = jwt.verify(token, process.env.JWT_SECRET).id;
      } catch {}
    }

    const newInquiry = {
      user: userId || undefined,
      name,
      phone: phone || '',
      message,
      createdAt: new Date(),
    };

    item.inquiries.push(newInquiry);
    await item.save();

    res.status(201).json(item.inquiries[item.inquiries.length - 1]);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

// ---- Delete Inquiry: DELETE /api/items/:id/inquiries/:inquiryId ----
router.delete('/:id/inquiries/:inquiryId', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: 'Item nahi mila' });

    const inquiry = item.inquiries.id(req.params.inquiryId);
    if (!inquiry) return res.status(404).json({ msg: 'Inquiry nahi mili' });

    // Allow deletion if caller is the item owner or the inquiry author
    const isItemOwner = item.user.toString() === req.userId;
    const isInquiryAuthor = inquiry.user && inquiry.user.toString() === req.userId;

    if (!isItemOwner && !isInquiryAuthor) {
      return res.status(403).json({ msg: 'Aap yeh paigham delete nahi kar sakte' });
    }

    inquiry.deleteOne();
    await item.save();
    res.json({ msg: 'Paigham delete ho gaya' });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

module.exports = router;
