const { validationResult } = require('express-validator');
const authService = require('../services/auth.service');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, 422, 'Validation failed', errors.array());
  const { name, email, password, phone, city } = req.body;
  const { user, token } = await authService.registerUser({ name, email, password, phone, city });
  return sendSuccess(res, 201, 'Account created successfully', { token, user: user.toPublicJSON() });
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, 422, 'Validation failed', errors.array());
  const { email, password } = req.body;
  const { user, token } = await authService.loginUser({ email, password });
  return sendSuccess(res, 200, 'Login successful', { token, user: user.toPublicJSON() });
};

const getMe = async (req, res) => {
  const user = await authService.getUserById(req.user.id);
  return sendSuccess(res, 200, 'Profile fetched', { user: user.toPublicJSON() });
};

const logout = async (req, res) =>
  sendSuccess(res, 200, 'Logged out successfully');

module.exports = { register, login, getMe, logout };
