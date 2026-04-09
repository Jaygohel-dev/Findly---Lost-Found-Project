const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  rater:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rated:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  item:    { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  score:   { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '', maxlength: 500 },
}, { timestamps: true });

ratingSchema.index({ rater: 1, item: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
