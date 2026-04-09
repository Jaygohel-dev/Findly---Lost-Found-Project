const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: [true, 'Name is required'], trim: true, minlength: 2, maxlength: 50 },
  email:    { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
  password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
  role:     { type: String, enum: ['user', 'admin'], default: 'user' },
  phone:    { type: String, default: '' },
  city:     { type: String, default: '' },
  avatar:   { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  rating:   { type: Number, default: 0, min: 0, max: 5 },
  totalRatings: { type: Number, default: 0 },
  itemsReported:  { type: Number, default: 0 },
  itemsRecovered: { type: Number, default: 0 },
  lastLogin: { type: Date, default: null },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// NOTE: unique: true in the email field already creates an index. 
// Adding userSchema.index({ email: 1 }) here causes the Mongoose Warning.

userSchema.virtual('avatarUrl').get(function () {
  return this.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=16a34a&color=fff`;
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id, name: this.name, email: this.email,
    role: this.role, phone: this.phone, city: this.city,
    avatar: this.avatarUrl, isActive: this.isActive,
    rating: this.rating, totalRatings: this.totalRatings,
    itemsReported: this.itemsReported, itemsRecovered: this.itemsRecovered,
    lastLogin: this.lastLogin, createdAt: this.createdAt,
  };
};

userSchema.statics.findByEmailWithPassword = function (email) {
  return this.findOne({ email, isActive: true }).select('+password');
};

module.exports = mongoose.model('User', userSchema);