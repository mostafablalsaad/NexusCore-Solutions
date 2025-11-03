const mongoose = require('mongoose');

// Cache the database connection for serverless optimization
let cachedConnection = null;

const connectDB = async () => {
  // If we have a cached connection and it's ready, reuse it
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('✅ Using cached database connection');
    return cachedConnection;
  }

  // If connection is in progress, don't start another one
  if (mongoose.connection.readyState === 2) {
    console.log('⏳ Connection already in progress, waiting...');
    // Wait for existing connection attempt
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Waited too long for existing connection'));
      }, 20000);

      mongoose.connection.once('connected', () => {
        clearTimeout(timeout);
        resolve(cachedConnection);
      });

      mongoose.connection.once('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });
  }

  try {
    // Check if MONGODB_URI exists
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    const options = {
      bufferCommands: false, // Disable buffering for serverless
      maxPoolSize: 10, // Connection pool size for serverless
      minPoolSize: 1, // Reduced from 2 to 1 for faster cold starts
      serverSelectionTimeoutMS: 8000, // Reduced to 8s
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip IPv6 for faster connection
      connectTimeoutMS: 8000, // 8s connection timeout
    };

    console.log('🔄 Connecting to MongoDB...');
    const connectStart = Date.now();

    // Set a timeout for the entire connection attempt (12 seconds max)
    const connectWithTimeout = Promise.race([
      mongoose.connect(process.env.MONGODB_URI, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout after 12s')), 12000)
      )
    ]);

    const conn = await connectWithTimeout;
    const connectTime = Date.now() - connectStart;
    console.log(`⚡ MongoDB connection established in ${connectTime}ms`);

    cachedConnection = conn;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    cachedConnection = null;

    // In production, log but don't throw - allow retry on next request
    if (process.env.NODE_ENV === 'production') {
      console.error('⚠️ Failed to connect to MongoDB. Will retry on next request.');
      return null;
    }

    // In development, throw the error for visibility
    throw error;
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
  cachedConnection = null;
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected from MongoDB');
  cachedConnection = null;
});

module.exports = connectDB;
