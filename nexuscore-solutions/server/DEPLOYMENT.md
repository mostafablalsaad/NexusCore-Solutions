# NexusCore Solutions - Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas**: Database instance at [mongodb.com/atlas](https://www.mongodb.com/atlas)
3. **Git Repository**: Code pushed to GitHub, GitLab, or Bitbucket

## Deployment Steps

### 1. Prepare Your MongoDB Database

1. Create a MongoDB Atlas account and cluster
2. Create a database user with read/write permissions
3. Whitelist all IP addresses (0.0.0.0/0) for serverless functions
4. Copy your connection string (it should look like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
   ```

### 2. Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### 3. Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your Git repository
4. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: `server` (or leave blank if deploying from server folder)
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty

5. Add Environment Variables (Settings → Environment Variables):

   ```env
   NODE_ENV=production
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-strong-secret-key-min-32-chars
   JWT_EXPIRE=30d
   CLIENT_URL=https://your-frontend-domain.vercel.app

   # Email Configuration (choose one)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   EMAIL_FROM=noreply@nexuscore.com

   # OR use SendGrid
   SENDGRID_API_KEY=your-sendgrid-key

   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-secret
   ```

6. Click **"Deploy"**

### 4. Deploy via CLI

```bash
cd server
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N** (first time)
- Project name? **nexuscore-solutions-api**
- Directory? **./** (current directory)

Add environment variables:
```bash
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add CLIENT_URL
# Add other variables as needed
```

Deploy to production:
```bash
vercel --prod
```

## Post-Deployment

### 1. Test Your Deployment

Visit your Vercel URL:
```
https://your-project.vercel.app/api/health
```

You should see:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Update Client URL

Add your Vercel API URL to your frontend `.env`:
```env
VITE_API_URL=https://your-project.vercel.app
```

### 3. Update CORS

Make sure `CLIENT_URL` environment variable includes your frontend domain:
```env
CLIENT_URL=https://your-frontend.vercel.app,https://www.yourdomain.com
```

For multiple domains, separate with commas.

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | Yes | Environment mode | `production` |
| `MONGODB_URI` | Yes | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Yes | Secret for JWT signing | Min 32 characters |
| `JWT_EXPIRE` | No | JWT expiration time | `30d` (default) |
| `CLIENT_URL` | Yes | Frontend URLs (comma-separated) | `https://app.com,https://www.app.com` |
| `EMAIL_HOST` | No* | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | No* | SMTP port | `587` |
| `EMAIL_USER` | No* | Email username | `user@gmail.com` |
| `EMAIL_PASSWORD` | No* | Email password | App password |
| `EMAIL_FROM` | No* | From email address | `noreply@app.com` |
| `SENDGRID_API_KEY` | No* | SendGrid API key | Alternative to SMTP |
| `CLOUDINARY_CLOUD_NAME` | No** | Cloudinary cloud name | For image uploads |
| `CLOUDINARY_API_KEY` | No** | Cloudinary API key | For image uploads |
| `CLOUDINARY_API_SECRET` | No** | Cloudinary secret | For image uploads |

\* Required if using email features
\** Required if using file upload features

## Troubleshooting

### Database Connection Issues

**Error**: "MONGODB_URI environment variable is not defined"

**Solution**: Add `MONGODB_URI` to Vercel environment variables

---

**Error**: "MongoServerError: bad auth"

**Solution**:
- Check username/password in connection string
- Ensure database user has correct permissions
- URL-encode special characters in password

---

### CORS Issues

**Error**: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution**:
- Add your frontend domain to `CLIENT_URL` environment variable
- Format: `https://your-domain.com` (no trailing slash)
- For multiple domains: `https://domain1.com,https://domain2.com`

---

### Function Timeout

**Error**: "Function execution timed out"

**Solution**:
- Optimize database queries
- Add indexes to frequently queried fields
- Consider upgrading Vercel plan for longer execution time

---

### Environment Variables Not Working

**Solution**:
1. Go to Project Settings → Environment Variables
2. Make sure variables are set for **Production** environment
3. Redeploy after adding/changing variables
4. Check variable names match exactly (case-sensitive)

## Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Update `CLIENT_URL` in frontend to use custom domain

## Monitoring

- **Logs**: Vercel Dashboard → Deployments → Click deployment → View logs
- **Analytics**: Available in Vercel Dashboard
- **Errors**: Check Runtime Logs for errors

## Local Development

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your environment variables to .env

# Run development server
npm run dev

# Server runs at http://localhost:5000
```

## Support

- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Issues: Open an issue in your repository

---

**Deployed Successfully?** Your API should now be live at `https://your-project.vercel.app` 🚀
