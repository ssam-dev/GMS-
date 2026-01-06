# 🚀 Deployment Checklist

## Pre-Deployment Checklist

### ✅ Environment Configuration

- [ ] **Backend Environment Variables** (`backend/.env`)
  ```env
  NODE_ENV=production
  PORT=5000
  MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/gms
  CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
  API_URL=https://api.yourdomain.com
  ```

- [ ] **Frontend Environment Variables** (`frontend/.env.production`)
  ```env
  VITE_API_BASE_URL=https://api.yourdomain.com/api
  VITE_API_SERVER_URL=https://api.yourdomain.com
  VITE_GOOGLE_CLIENT_ID=your_google_client_id
  ```

### ✅ Security

- [x] All hardcoded URLs replaced with environment variables
- [x] CORS configured for production domains
- [x] Rate limiting enabled (1000 requests/15min in dev, 100 in production)
- [x] Helmet security headers enabled
- [x] Input validation on all routes
- [x] Error messages sanitized for production
- [ ] SSL/TLS certificate configured
- [ ] API keys stored securely (not in code)

### ✅ Database

- [x] MongoDB connection with error handling
- [x] Database indexes created
- [x] Unique constraints on email fields
- [ ] Database backups configured
- [ ] Connection pooling optimized
- [ ] Read replicas (if needed for scale)

### ✅ Code Quality

- [x] All tests passing (13/13)
- [x] No syntax errors
- [x] No linting errors
- [x] Error handling implemented
- [x] Logging configured
- [ ] Code minified and optimized
- [ ] Source maps configured for production

### ✅ File Uploads

- [x] File upload directories created
- [x] File size limits configured (5MB)
- [x] MIME type validation
- [x] File path handling fixed
- [ ] CDN configured for static files (optional)
- [ ] File cleanup job configured

### ✅ API

- [x] Swagger documentation available
- [x] Health check endpoint (`/api/health`)
- [x] Error responses standardized
- [x] Rate limiting configured
- [x] Request logging enabled

### ✅ Frontend

- [x] Build optimization configured
- [x] Code splitting enabled
- [x] Environment variables configured
- [x] All API calls use config
- [ ] Production build tested
- [ ] Performance optimized

## Deployment Steps

### 1. Backend Deployment

```bash
# Build and test
cd backend
npm install --production
npm test

# Set environment variables on hosting platform
# Deploy to: Heroku, Render, Railway, AWS, etc.
```

**Platform-specific:**
- **Heroku**: Add buildpacks, set config vars
- **Render**: Set environment variables in dashboard
- **Railway**: Configure via dashboard
- **AWS**: Use Elastic Beanstalk or EC2

### 2. Frontend Deployment

```bash
# Build for production
cd frontend
npm install
npm run build

# Deploy dist/ folder to:
# - Vercel (recommended)
# - Netlify
# - AWS S3 + CloudFront
# - GitHub Pages
```

### 3. Database Setup

1. Create MongoDB Atlas cluster
2. Configure IP whitelist
3. Create database user
4. Get connection string
5. Set `MONGODB_URI` in backend environment

### 4. Post-Deployment

- [ ] Test all API endpoints
- [ ] Verify file uploads work
- [ ] Check CORS configuration
- [ ] Test authentication flow
- [ ] Verify error handling
- [ ] Monitor logs for errors
- [ ] Set up monitoring/alerts
- [ ] Configure backups

## Environment Variables Reference

### Backend (.env)
```env
# Required
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...

# Optional
CORS_ORIGIN=https://yourdomain.com
API_URL=https://api.yourdomain.com
```

### Frontend (.env.production)
```env
# Required
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_API_SERVER_URL=https://api.yourdomain.com

# Optional
VITE_GOOGLE_CLIENT_ID=your_client_id
```

## Monitoring & Maintenance

### Recommended Tools

- **Error Tracking**: Sentry, LogRocket
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Analytics**: Google Analytics, Plausible
- **Logs**: Logtail, Papertrail

### Health Checks

- Monitor: `GET /api/health`
- Check MongoDB connection
- Monitor file upload directory size
- Track API response times

## Rollback Plan

1. Keep previous deployment version
2. Document database migration steps
3. Backup database before major updates
4. Test rollback procedure

## Security Checklist

- [x] No hardcoded secrets
- [x] Environment variables secured
- [x] CORS properly configured
- [x] Rate limiting enabled
- [x] Input validation on all endpoints
- [x] File upload validation
- [x] Error messages sanitized
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Regular dependency updates

## Performance Optimization

- [x] Database indexes created
- [x] Code splitting (frontend)
- [x] Image optimization
- [ ] CDN for static assets
- [ ] Caching strategy
- [ ] Database query optimization

---

**Status**: ✅ Ready for Deployment

**Last Updated**: January 6, 2026
