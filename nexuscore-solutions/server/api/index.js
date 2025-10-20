require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const connectDB = require('../src/config/db');
const errorHandler = require('../src/middleware/errorHandler');
const { apiLimiter } = require('../src/middleware/rateLimit');

const app = express();

// Connect to database (with connection pooling for serverless)
let cachedDb = null;
const connectToDatabase = async () => {
  if (cachedDb) {
    return cachedDb;
  }
  cachedDb = await connectDB();
  return cachedDb;
};

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
const allowedOrigins = process.env.CLIENT_URL 
  ? process.env.CLIENT_URL.split(',').map(url => url.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS not allowed'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting (with Redis-compatible memory store for serverless)
app.use('/api/', apiLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Import routes
const authRoutes = require('../src/routes/auth');
const serviceRoutes = require('../src/routes/services');
const projectRoutes = require('../src/routes/projects');
const caseStudyRoutes = require('../src/routes/caseStudies');
const whitepaperRoutes = require('../src/routes/whitepapers');
const teamRoutes = require('../src/routes/team');
const achievementRoutes = require('../src/routes/achievements');
const contactRoutes = require('../src/routes/contact');
const newsletterRoutes = require('../src/routes/newsletter');
const dashboardRoutes = require('../src/routes/dashboard');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/case-studies', caseStudyRoutes);
app.use('/api/whitepapers', whitepaperRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/admin', dashboardRoutes);

// Admin-only routes
const { protect, admin } = require('../src/middleware/auth');

app.use('/api/admin/services', protect, admin, serviceRoutes);
app.use('/api/admin/projects', protect, admin, projectRoutes);
app.use('/api/admin/case-studies', protect, admin, caseStudyRoutes);
app.use('/api/admin/whitepapers', protect, admin, whitepaperRoutes);
app.use('/api/admin/team', protect, admin, teamRoutes);
app.use('/api/admin/achievements', protect, admin, achievementRoutes);
app.use('/api/admin/messages', protect, admin, contactRoutes);
app.use('/api/admin/subscribers', protect, admin, newsletterRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Route not found' 
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Connect to DB before handling request
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});