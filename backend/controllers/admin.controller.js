const User = require('../models/user.model');
const Item = require('../models/item.model');
const { sendSuccess } = require('../utils/apiResponse');
const AppError = require('../utils/AppError');

const getStats = async (req, res) => {
  const [users, totalItems, lostItems, foundItems, recovered, matched] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Item.countDocuments(),
    Item.countDocuments({ type: 'lost' }),
    Item.countDocuments({ type: 'found' }),
    Item.countDocuments({ status: 'recovered' }),
    Item.countDocuments({ status: 'matched' }),
  ]);
  const recoveryRate = totalItems > 0 ? Math.round((recovered / totalItems) * 100) : 0;
  return sendSuccess(res, 200, 'Admin stats fetched', { users, totalItems, lostItems, foundItems, recovered, matched, recoveryRate });
};

const getAllUsers = async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  return sendSuccess(res, 200, 'Users fetched', { users });
};

const toggleUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found.', 404);
  if (user.role === 'admin') throw new AppError('Cannot modify admin accounts.', 403);
  user.isActive = !user.isActive;
  await user.save({ validateBeforeSave: false });
  return sendSuccess(res, 200, `User ${user.isActive ? 'activated' : 'suspended'}`, { user: user.toPublicJSON() });
};

const getAllItems = async (req, res) => {
  const items = await Item.find().populate('owner', 'name email').sort({ createdAt: -1 });
  return sendSuccess(res, 200, 'All items fetched', { items });
};

const deleteItem = async (req, res) => {
  const item = await Item.findByIdAndDelete(req.params.id);
  if (!item) throw new AppError('Item not found.', 404);
  return sendSuccess(res, 200, 'Item deleted by admin');
};

const moderateItem = async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.params.id, { isModerated: true }, { new: true });
  if (!item) throw new AppError('Item not found.', 404);
  return sendSuccess(res, 200, 'Item moderated', { item });
};

module.exports = { getStats, getAllUsers, toggleUser, getAllItems, deleteItem, moderateItem };
