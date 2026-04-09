const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

const handleCastError      = (e) => new AppError(`Invalid ${e.path}: ${e.value}`, 400);
const handleDuplicateFields = (e) => new AppError(`"${Object.keys(e.keyValue)[0]}" already exists.`, 409);
const handleValidationError = (e) => new AppError(Object.values(e.errors).map(v => v.message).join('. '), 422);
const handleJWTError        = () => new AppError('Invalid token. Please log in again.', 401);
const handleJWTExpired      = () => new AppError('Token expired. Please log in again.', 401);

const notFound = (req, res, next) =>
  next(new AppError(`Cannot ${req.method} ${req.originalUrl}`, 404));

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    logger.error(`${err.statusCode} ${err.message}`);
    return res.status(err.statusCode).json({
      success: false, message: err.message, stack: err.stack, error: err,
    });
  }

  let error = { ...err, message: err.message };
  if (err.name === 'CastError')        error = handleCastError(err);
  if (err.code === 11000)              error = handleDuplicateFields(err);
  if (err.name === 'ValidationError')  error = handleValidationError(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpired();

  if (error.isOperational) {
    return res.status(error.statusCode).json({ success: false, message: error.message });
  }

  logger.error('UNEXPECTED ERROR:', err);
  return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
};

module.exports = { notFound, errorHandler };
