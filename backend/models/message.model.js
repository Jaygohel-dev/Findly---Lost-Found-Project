const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  item:     { type: mongoose.Schema.Types.ObjectId, ref: 'Item',    required: true },
  sender:   { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
  content:  { type: String, required: true, maxlength: 1000 },
  read:     { type: Boolean, default: false },
}, { timestamps: true });

messageSchema.index({ item: 1, createdAt: 1 });
messageSchema.index({ receiver: 1, read: 1 });

module.exports = mongoose.model('Message', messageSchema);
