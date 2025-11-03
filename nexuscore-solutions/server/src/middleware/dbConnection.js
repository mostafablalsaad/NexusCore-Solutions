const connectDB = require('../config/db');
const mongoose = require('mongoose');

/**
 * Middleware to ensure database connection before processing requests
 * This prevents timeout issues in serverless environments
 */
const ensureDbConnection = async (req, res, next) => {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      return next();
    }

    // If not connected, try to connect
    console.log('Database not connected, attempting to connect...');
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(503).json({
      success: false,
      error: 'Database connection failed. Please try again later.',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = ensureDbConnection;
