# NexusCore Solutions - Full-Stack Platform

> **Professional full-stack marketing & content management platform for B2B software engineering firm**

A modern, high-performance web application built with **React + TypeScript** (frontend) and **Node.js + Express + MongoDB** (backend).

## 🎯 Features

### Public Website
- ✅ Modern, responsive design with dark/light mode
- ✅ Dynamic homepage with hero section and featured projects
- ✅ Services showcase by industry
- ✅ Filterable project portfolio
- ✅ Detailed case studies with metrics
- ✅ Downloadable whitepapers and resources
- ✅ Team member profiles
- ✅ Achievements and certifications
- ✅ Contact form with email notifications
- ✅ Newsletter subscription with double opt-in
- ✅ SEO optimized with meta tags
- ✅ Smooth animations with Framer Motion

### Admin Dashboard
- ✅ Secure JWT authentication
- ✅ Dashboard with analytics and statistics
- ✅ Full CRUD operations for all content
- ✅ Image and PDF upload to Cloudinary
- ✅ Contact message management
- ✅ Newsletter subscriber management
- ✅ CSV export functionality
- ✅ Responsive admin interface

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **React Toastify** - Toast notifications
- **Lucide React** - Beautiful icons
- **date-fns** - Date utilities

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Joi** - Input validation
- **Multer + Cloudinary** - File uploads
- **SendGrid/Nodemailer** - Email service
- **Helmet** - Security headers
- **Express Rate Limit** - API protection
- **Morgan** - Logging
- **Compression** - Response compression

## 📁 Project Structure

```
nexuscore-solutions/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utility functions
│   │   ├── types/         # TypeScript types
│   │   └── styles/        # Global styles
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Custom middleware
│   │   └── utils/         # Utility functions
│   ├── package.json
│   └── .env
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18 or higher
- **MongoDB** (local or Atlas)
- **Cloudinary** account (for file uploads)
- **SendGrid** account (for emails) - or use SMTP

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd nexuscore-solutions
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create `.env` file in `server/` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/nexuscore

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRE=7d

# Email (SendGrid)
EMAIL_FROM=noreply@nexuscore.com
SENDGRID_API_KEY=your-sendgrid-api-key
ADMIN_EMAIL=admin@nexuscore.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS
CLIENT_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Create admin user:**
```bash
npm run create-admin
```

This creates:
- Email: `admin@nexuscore.com`
- Password: `admin123456`

**Seed sample data (optional):**
```bash
npm run seed
```

**Start backend server:**
```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Frontend Setup

Open new terminal:

```bash
cd client
npm install
```

Create `.env` file in `client/` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=NexusCore Solutions
```

**Start frontend:**
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

### 4. Access the Application

- **Website**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin/login
  - Email: `admin@nexuscore.com`
  - Password: `admin123456`

## 📝 API Documentation

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Public Endpoints

**Services**
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get single service

**Projects**
- `GET /api/projects` - Get all projects (supports filters)
- `GET /api/projects/:id` - Get single project

**Case Studies**
- `GET /api/case-studies` - Get all case studies
- `GET /api/case-studies/:id` - Get single case study

**Whitepapers**
- `GET /api/whitepapers` - Get all whitepapers
- `GET /api/whitepapers/:id` - Get single whitepaper
- `GET /api/whitepapers/:id/download` - Track download

**Team**
- `GET /api/team` - Get all team members

**Achievements**
- `GET /api/achievements` - Get all achievements

**Contact**
- `POST /api/contact` - Submit contact form

**Newsletter**
- `POST /api/newsletter/subscribe` - Subscribe
- `GET /api/newsletter/confirm/:token` - Confirm subscription
- `POST /api/newsletter/unsubscribe` - Unsubscribe

### Admin Endpoints (Protected)

All admin endpoints require `Authorization: Bearer <token>` header.

**Services CRUD**
- `POST /api/admin/services`
- `PUT /api/admin/services/:id`
- `DELETE /api/admin/services/:id`

**Projects CRUD**
- `POST /api/admin/projects`
- `PUT /api/admin/projects/:id`
- `DELETE /api/admin/projects/:id`

**Case Studies CRUD**
- `POST /api/admin/case-studies`
- `PUT /api/admin/case-studies/:id`
- `DELETE /api/admin/case-studies/:id`

**Whitepapers CRUD**
- `POST /api/admin/whitepapers`
- `PUT /api/admin/whitepapers/:id`
- `DELETE /api/admin/whitepapers/:id`

**Team CRUD**
- `POST /api/admin/team`
- `PUT /api/admin/team/:id`
- `DELETE /api/admin/team/:id`

**Achievements CRUD**
- `POST /api/admin/achievements`
- `PUT /api/admin/achievements/:id`
- `DELETE /api/admin/achievements/:id`

**Messages**
- `GET /api/admin/messages` - Get all messages
- `PUT /api/admin/messages/:id/read` - Mark as read
- `PUT /api/admin/messages/:id/respond` - Add response
- `GET /api/admin/messages/export` - Export to CSV

**Subscribers**
- `GET /api/admin/subscribers` - Get all subscribers
- `GET /api/admin/subscribers/export` - Export to CSV
- `DELETE /api/admin/subscribers/:id` - Delete subscriber

**Dashboard**
- `GET /api/admin/stats` - Get dashboard statistics

**File Upload**
- `POST /api/admin/upload/image` - Upload image
- `POST /api/admin/upload/pdf` - Upload PDF

## 🔒 Security Features

- ✅ JWT authentication with secure token storage
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Rate limiting on all public endpoints
- ✅ Input validation with Joi
- ✅ Helmet.js for security headers
- ✅ CORS configuration with whitelist
- ✅ File upload validation (type, size)
- ✅ SQL/NoSQL injection prevention
- ✅ XSS prevention (input sanitization)
- ✅ Error handling without exposing internals

## 🎨 Design Features

- Modern, minimalist aesthetic
- Smooth animations with Framer Motion
- Dark/Light mode toggle
- Fully responsive (mobile-first)
- Accessible (WCAG compliant)
- SEO optimized with meta tags
- Fast loading with code splitting
- Lazy loading for images

## 📧 Email Configuration

### Using SendGrid (Recommended)

1. Sign up at https://sendgrid.com
2. Create API key
3. Add to `.env`:
```env
SENDGRID_API_KEY=your-api-key
EMAIL_FROM=noreply@yourdomain.com
```

### Using Gmail SMTP

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_FROM=your-email@gmail.com
```

Generate app password: https://myaccount.google.com/apppasswords

## ☁️ Cloud Storage Setup

### Cloudinary Setup

1. Sign up at https://cloudinary.com
2. Get credentials from dashboard
3. Add to `.env`:
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 🚢 Deployment

### Backend Deployment (Railway/Render/Heroku)

1. **Railway** (Recommended):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add environment variables in Railway dashboard

# Deploy
railway up
```

2. **Environment Variables**: Set all variables from `.env` in platform dashboard

3. **MongoDB Atlas**:
- Create cluster at https://mongodb.com/atlas
- Whitelist all IPs (0.0.0.0/0) or specific IPs
- Get connection string
- Update `MONGODB_URI` in env variables

### Frontend Deployment (Vercel/Netlify)

1. **Vercel** (Recommended):
```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to client folder
cd client

# Deploy
vercel
```

2. **Build Settings**:
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

3. **Environment Variables**:
```env
VITE_API_URL=https://your-backend-url.railway.app/api
VITE_APP_NAME=NexusCore Solutions
```

4. **Add `_redirects` file** in `client/public/`:
```
/*    /index.html   200
```

## 🧪 Testing

### Backend Testing
```bash
cd server
npm test
```

### Frontend Testing
```bash
cd client
npm test
```

### API Testing with cURL

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nexuscore.com","password":"admin123456"}'
```

**Get Projects:**
```bash
curl http://localhost:5000/api/projects
```

**Create Project (Admin):**
```bash
curl -X POST http://localhost:5000/api/admin/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"New Project","shortDesc":"Description","industry":"renewable","thumbnail":"https://example.com/image.jpg","fullDesc":"Full description here"}'
```

## 📊 Database Schema

### Collections:
- `users` - Admin users
- `services` - Services offered
- `projects` - Project portfolio
- `casestudies` - Case studies
- `whitepapers` - Downloadable resources
- `teammembers` - Team profiles
- `achievements` - Awards and certifications
- `contactmessages` - Contact form submissions
- `newslettersubscribers` - Email subscribers

## 🛠️ Development

### Code Structure Best Practices

- Components are organized by feature
- Custom hooks for reusable logic
- Context for global state management
- TypeScript for type safety
- Consistent naming conventions
- Comprehensive error handling
- Loading states for async operations

### Adding New Features

1. **Backend**:
   - Create Mongoose model in `server/src/models/`
   - Create controller in `server/src/controllers/`
   - Create routes in `server/src/routes/`
   - Add validation schema in `server/src/middleware/validation.js`
   - Mount routes in `server/src/server.js`

2. **Frontend**:
   - Add TypeScript types in `client/src/types/`
   - Create components in `client/src/components/`
   - Create pages in `client/src/pages/`
   - Add routes in `client/src/App.tsx`
   - Update navigation if needed

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error:**
```
Solution: Ensure MongoDB is running locally or check Atlas connection string
```

**CORS Error:**
```
Solution: Add frontend URL to CLIENT_URL in backend .env
```

**Upload Fails:**
```
Solution: Check Cloudinary credentials and file size limits
```

**Email Not Sending:**
```
Solution: Verify SendGrid API key or SMTP credentials
```

### Logs

**Backend logs:**
```bash
cd server
npm run dev
```

**Check MongoDB:**
```bash
mongosh
use nexuscore
db.users.find()
```

## 📖 Additional Resources

- [React Documentation](https://react.dev)