const { verifyToken } = require('../config/jwt');
const User = require('../models/user.model');
const AppError = require('../utils/AppError');

const protect = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer '))
    return next(new AppError('Authentication required. Please log in.', 401));

  const token = auth.split(' ')[1];
  const decoded = verifyToken(token);

  const user = await User.findById(decoded.id).select('-password');
  if (!user) return next(new AppError('User no longer exists.', 401));
  if (!user.isActive) return next(new AppError('Your account has been deactivated.', 403));

  req.user = user;
  next();
};

const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return next(new AppError('You do not have permission to perform this action.', 403));
  next();
};

module.exports = { protect, restrictTo };
