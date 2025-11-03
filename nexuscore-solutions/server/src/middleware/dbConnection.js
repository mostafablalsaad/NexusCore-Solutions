const connectDB = require('../config/db');
const mongoose = require('mongoose');

/**
 * Middleware to ensure database connection before processing requests
 * This prevents timeout issues in serverless environments
 */
const ensureDbConnection = async (req, res, next) => {
  const startTime = Date.now();

  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log('✅ DB already connected (cached)');
      return next();
    }

    // If not connected, try to connect
    console.log('⚠️ Database not connected, attempting to connect...');
    console.log(`Request: ${req.method} ${req.path}`);

    const connectTimeout = setTimeout(() => {
      console.error('❌ DB connection taking too long (>10s)');
    }, 10000);

    await connectDB();

    clearTimeout(connectTimeout);

    const elapsed = Date.now() - startTime;
    console.log(`✅ DB connected in ${elapsed}ms`);

    next();
  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`❌ Database connection error after ${elapsed}ms:`, error.message);

    return res.status(503).json({
      success: false,
      error: 'Database connection failed. Please try again later.',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined,
      details: process.env.NODE_ENV === 'development' ? {
        readyState: mongoose.connection.readyState,
        elapsed: `${elapsed}ms`
      } : undefined
    });
  }
};

module.exports = ensureDbConnection;
