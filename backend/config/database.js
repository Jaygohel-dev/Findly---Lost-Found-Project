const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    // This .trim() removes any hidden spaces or newlines from the .env file
    const dbURI = process.env.MONGO_URI ? process.env.MONGO_URI.trim() : null;

    if (!dbURI) {
      throw new Error("MONGO_URI is missing from process.env");
    }

    const conn = await mongoose.connect(dbURI, { 
      maxPoolSize: 10 
    });

    logger.info(`MongoDB connected: ${conn.connection.host}`);
    
    mongoose.connection.on('error', (err) => logger.error(`MongoDB error: ${err.message}`));
    mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
  } catch (error) {
    
    logger.error(`Database connection failed. URI starts with: ${process.env.MONGO_URI?.substring(0, 15)}`);
    throw error; 
  }
};

module.exports = connectDB;