require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const connectDB = require('../src/config/db');
const errorHandler = require('../src/middleware/errorHandler');
const { apiLimiter } = require('../src/middleware/rateLimit');

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
const app = express();

// Database connection middleware (import early)
const ensureDbConnection = require('../src/middleware/dbConnection');

// Admin-only routes for CRUD operations
const { protect, admin } = require('../src/middleware/auth');
const { seedData } = require('../src/utils/seed');

// Connect to database (don't await, let it connect in background)
// Connection will be cached for subsequent requests
connectDB().catch(err => {
  console.error('Initial database connection failed:', err.message);
  // Don't throw - allow app to start, connection will retry on requests
});

app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

console.log("CLIENT_URL:", process.env.CLIENT_URL);
// CORS configuration
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map(url => url.trim())
  : "*";

console.log("Allowed CORS origins:", allowedOrigins);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);

    // Check if origin is in allowed list or wildcard
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }

    console.warn(`CORS blocked origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting





// Health check (no middleware, super fast)
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// seedData(); // Comment out - only run manually with npm run seed
// Apply DB connection middleware to all API routes (except health check)
// This runs BEFORE rate limiter to fail fast if DB is down
app.use('/api', (req, res, next) => {
  // Skip DB connection for health check
  if (req.path === '/health') {
    return next();
  }
  return ensureDbConnection(req, res, next);
});

// Apply rate limiter AFTER DB check (so we don't rate limit DB connection attempts)
// Disabled in production for now to prevent serverless issues
if (process.env.NODE_ENV !== 'production') {
  app.use('/api/', apiLimiter);
  console.log('✅ Rate limiting enabled');
} else {
  console.log('⚠️ Rate limiting disabled in production (serverless)');
}

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects',projectRoutes);
app.use('/api/case-studies', caseStudyRoutes);
app.use('/api/whitepapers', whitepaperRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/admin', dashboardRoutes);


// Services admin routes
app.use('/api/admin/services', protect, admin, serviceRoutes);

// Projects admin routes
app.use('/api/admin/projects', protect, admin, projectRoutes);

// Case studies admin routes
app.use('/api/admin/case-studies', protect, admin, caseStudyRoutes);

// Whitepapers admin routes
app.use('/api/admin/whitepapers', protect, admin, whitepaperRoutes);

// Team admin routes
app.use('/api/admin/team', protect, admin, teamRoutes);

// Achievements admin routes
app.use('/api/admin/achievements', protect, admin, achievementRoutes);

// Contact admin routes
app.use('/api/admin/messages', protect, admin, contactRoutes);

// Newsletter admin routes
app.use('/api/admin/subscribers', protect, admin, newsletterRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Route not found' 
  });
});

if(process.env.NODE_ENV==='development'){
  console.log('✅ 404 handler enabled');
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`🚀 Server running in development mode ${port}`);
  });
}


// Error handler (must be last)
app.use(errorHandler);



module.exports = app;






