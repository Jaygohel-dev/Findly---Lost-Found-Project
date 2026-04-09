const User   = require('../models/user.model');
const Rating = require('../models/rating.model');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const AppError = require('../utils/AppError');

const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new AppError('User not found', 404);
  return sendSuccess(res, 200, 'Profile retrieved', { user: user.toPublicJSON() });
};

const updateProfile = async (req, res) => {
  const allowed = ['name', 'phone', 'city', 'avatar'];
  const updates = {};
  allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
  return sendSuccess(res, 200, 'Profile updated', { user: user.toPublicJSON() });
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)
    throw new AppError('Both current and new password are required.', 400);
  if (newPassword.length < 6)
    throw new AppError('New password must be at least 6 characters.', 400);
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.comparePassword(currentPassword)))
    throw new AppError('Current password is incorrect.', 401);
  user.password = newPassword;
  await user.save();
  return sendSuccess(res, 200, 'Password changed successfully');
};

const rateUser = async (req, res) => {
  const { ratedUserId, itemId, score, comment } = req.body;
  if (!score || score < 1 || score > 5)
    throw new AppError('Score must be between 1 and 5.', 400);
  const existing = await Rating.findOne({ rater: req.user.id, item: itemId });
  if (existing) throw new AppError('You have already rated this user for this item.', 400);

  await Rating.create({ rater: req.user.id, rated: ratedUserId, item: itemId, score, comment });
  const ratings = await Rating.find({ rated: ratedUserId });
  const avg = ratings.reduce((a, r) => a + r.score, 0) / ratings.length;
  await User.findByIdAndUpdate(ratedUserId, { rating: Number(avg.toFixed(1)), totalRatings: ratings.length });

  return sendSuccess(res, 201, 'Rating submitted successfully');
};

module.exports = { getProfile, updateProfile, changePassword, rateUser };
