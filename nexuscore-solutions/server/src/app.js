require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimit');

// Connect to database
connectDB();

const app = express();

app.set('trust proxy', true);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
const allowedOrigins = process.env.CLIENT_URL 
  ? process.env.CLIENT_URL
  : 'http://localhost:5173';



  console.log("the origin of the cors for the production",allowedOrigins);
app.use(cors({
  origin: function(origin, callback) {
    console.log("the origin of the cors",origin);
    
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

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', (req,res)=>{
  res.status(200).json({message:"projects route is working"});
});
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



