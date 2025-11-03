require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimit');

const app = express();

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


// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});


app.use('/api/', apiLimiter);

// Database connection middleware
const ensureDbConnection = require('./middleware/dbConnection');

// Import routes
const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const projectRoutes = require('./routes/projects');
const caseStudyRoutes = require('./routes/caseStudies');
const whitepaperRoutes = require('./routes/whitepapers');
const teamRoutes = require('./routes/team');
const achievementRoutes = require('./routes/achievements');
const contactRoutes = require('./routes/contact');
const newsletterRoutes = require('./routes/newsletter');
const dashboardRoutes = require('./routes/dashboard');


console.log("Mounting API routes...");
// Apply DB connection middleware to all API routes (except health check)
app.use('/api', (req, res, next) => {
  // Skip DB connection for health check
  if (req.path === '/health') {
    return next();
  }
  return ensureDbConnection(req, res, next);
});

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

// Admin-only routes for CRUD operations
const { protect, admin } = require('./middleware/auth');

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


// Error handler (must be last)
app.use(errorHandler);



module.exports = app;



