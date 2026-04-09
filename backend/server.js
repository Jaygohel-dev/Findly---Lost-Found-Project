require('dotenv').config(); // Remove debug once it works
require('express-async-errors');

const connectDB = require('./config/database'); // Move this up
const logger = require('./utils/logger');
const app = require('./app'); // Import app AFTER loading env/config

const PORT = process.env.PORT || 5000;
// ... rest of your code

const startServer = async () => {
  // Guard clause for connection string
  if (!process.env.MONGO_URI) {
    logger.error('CRITICAL ERROR: MONGO_URI is not defined in .env');
    process.exit(1);
  }

  try {
    await connectDB();
    const server = app.listen(PORT, () =>
      logger.info(`🚀 Findly API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
    );

    process.on('SIGTERM', () => {
      logger.info('SIGTERM received — shutting down gracefully');
      server.close(() => process.exit(0));
    });

    process.on('unhandledRejection', (err) => {
      logger.error(`Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });

    process.on('uncaughtException', (err) => {
      logger.error(`Uncaught Exception: ${err.message}`);
      process.exit(1);
    });
  } catch (err) {
    logger.error(`Server failed to start: ${err.message}`);
    process.exit(1);
  }
};

startServer();