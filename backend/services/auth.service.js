const User = require('../models/user.model');
const { generateToken } = require('../config/jwt');
const AppError = require('../utils/AppError');

const registerUser = async ({ name, email, password, phone, city }) => {
  const exists = await User.findOne({ email });
  if (exists) throw new AppError('An account with this email already exists.', 409);
  const user = await User.create({ name, email, password, phone, city });
  const token = generateToken(user._id);
  return { user, token };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findByEmailWithPassword(email);
  if (!user || !(await user.comparePassword(password)))
    throw new AppError('Invalid email or password.', 401);
  if (!user.isActive)
    throw new AppError('Your account has been deactivated. Contact support.', 403);
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });
  const token = generateToken(user._id);
  return { user, token };
};

const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new AppError('User not found.', 404);
  return user;
};

module.exports = { registerUser, loginUser, getUserById };
