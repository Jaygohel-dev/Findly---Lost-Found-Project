const mongoose = require('mongoose');

const CATEGORIES = ['electronics', 'wallet', 'keys', 'bag', 'documents', 'jewelry', 'clothing', 'pet', 'other'];
const STATUSES   = ['active', 'matched', 'recovered', 'closed'];

const itemSchema = new mongoose.Schema({
  type:     { type: String, enum: ['lost', 'found'], required: true },
  title:    { type: String, required: [true, 'Title is required'], trim: true, maxlength: 100 },
  description: { type: String, required: [true, 'Description is required'], maxlength: 1000 },
  category: { type: String, enum: CATEGORIES, required: [true, 'Category is required'] },
  status:   { type: String, enum: STATUSES, default: 'active' },

  location: {
    address: { type: String, required: [true, 'Location is required'] },
    lat:  { type: Number, default: null },
    lng:  { type: Number, default: null },
  },

  date:   { type: Date, required: true },
  images: [{ type: String }],
  color:  { type: String, default: '' },
  brand:  { type: String, default: '' },
  reward: { type: String, default: '' },
  qrCode: { type: String, default: '' },

  owner:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  matchedWith: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },

  views:       { type: Number, default: 0 },
  isModerated: { type: Boolean, default: false },
}, { timestamps: true });

itemSchema.index({ title: 'text', description: 'text' });
itemSchema.index({ type: 1, category: 1, status: 1 });
itemSchema.index({ owner: 1 });

module.exports = mongoose.model('Item', itemSchema);
