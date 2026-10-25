const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true, trim: true },
  phone: { type: String, trim: true, default: '' },
  message: { type: String, required: true, trim: true, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
});

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true },
  answer: { type: String, required: true, trim: true },
});

const itemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['lost', 'found'], required: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 1500, default: '' },
    category: {
      type: String,
      enum: ['phone', 'wallet', 'bag', 'keys', 'documents', 'electronics', 'pet', 'jewellery', 'vehicles', 'clothing', 'other'],
      default: 'other',
    },
    location: { type: String, required: true, trim: true },
    city: { type: String, trim: true, default: '' },
    date: { type: Date, default: Date.now },
    contactName: { type: String, trim: true, default: '' },
    contactPhone: { type: String, required: true, trim: true },
    whatsapp: { type: String, trim: true, default: '' },
    image: { type: String, default: '' },
    images: [{ type: String }], // Multi-image support (3-5 images)
    
    // Real item specifications
    brand: { type: String, trim: true, default: '' },
    modelNumber: { type: String, trim: true, default: '' },
    color: { type: String, trim: true, default: '' },
    condition: {
      type: String,
      enum: ['Brand New', 'Like New', 'Used / Good', 'Fair / Scratched', 'Not Specified'],
      default: 'Used / Good',
    },
    identifyingMarks: { type: String, trim: true, default: '' },
    claimRequirement: { type: String, trim: true, default: '' },
    
    faqs: [faqSchema],
    status: { type: String, enum: ['open', 'resolved'], default: 'open' },
    resolvedDate: { type: Date },
    views: { type: Number, default: 0 },
    inquiries: [inquirySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);
