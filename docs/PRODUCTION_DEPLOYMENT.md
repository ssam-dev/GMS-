# Production Environment Setup Guide

## 📋 Overview

This guide explains how to configure your GMS application for production deployment.

## 🔧 Environment Variables

### Backend Configuration

**File:** `backend/.env`

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gms?retryWrites=true&w=majority

# Frontend Origin (for CORS)
CORS_ORIGIN=https://yourdomain.com

# Security
SESSION_SECRET=generate-a-secure-random-string-here
```

### Frontend Configuration

**File:** `frontend/.env.production`

```env
# API Configuration
VITE_API_URL=https://api.yourdomain.com

# Google OAuth (optional)
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
```

---

## 🔐 Security Checklist

### Database Security
- ✅ Use MongoDB Atlas (managed MongoDB)
- ✅ Enable IP whitelist
- ✅ Use strong passwords
- ✅ Enable SSL/TLS connections
- ✅ Regular backups enabled

### API Security
- ✅ HTTPS only (SSL/TLS certificate)
- ✅ CORS properly configured
- ✅ Rate limiting enabled
- ✅ Input validation on all routes
- ✅ Password hashing with bcrypt
- ✅ Security headers (Helmet)

### Application Security
- ✅ No sensitive data in logs
- ✅ Error messages don't expose internals
- ✅ Environment variables not in git
- ✅ .gitignore configured correctly
- ✅ Regular dependency updates

---

## 📊 Performance Optimization

### Database
- ✅ Indexes created on frequently queried fields
- ✅ Connection pooling configured
- ✅ Query optimization

### API
- ✅ Response compression (gzip)
- ✅ Rate limiting
- ✅ Caching headers

### Frontend
- ✅ Code minification
- ✅ Image optimization
- ✅ Lazy loading
- ✅ Bundle size optimization

---

## 🚀 Deployment Steps

### 1. MongoDB Atlas Setup

```
1. Go to https://www.mongodb.com/cloud/atlas
2. Create account and organization
3. Create cluster (free tier available)
4. Add database user with strong password
5. Whitelist IP addresses
6. Copy connection string (format: mongodb+srv://user:password@cluster.mongodb.net/db)
7. Update MONGODB_URI in backend/.env
```

### 2. Backend Deployment (Heroku Example)

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set CORS_ORIGIN=https://yourdomain.com
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### 3. Frontend Deployment (Vercel Example)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Set environment variables in Vercel dashboard
VITE_API_URL=https://your-backend.herokuapp.com
```

### 4. Google OAuth Setup

```
1. Go to https://console.cloud.google.com
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized origins:
   - https://yourdomain.com
   - https://www.yourdomain.com
6. Add authorized redirect URIs
7. Copy Client ID to frontend/.env.production
8. Update VITE_GOOGLE_CLIENT_ID
```

---

## 🔍 Monitoring & Logging

### Application Logging
- Uses Morgan for HTTP request logging
- All requests logged with status, method, response time

### Error Monitoring (Optional)
Consider adding Sentry or similar:
```javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV,
});
```

### Performance Monitoring
- Track API response times
- Monitor database query performance
- Alert on errors

---

## 📈 Scaling Considerations

### Current Setup
- Single backend instance
- Managed MongoDB
- CDN optional

### For High Traffic
- Load balancing (Heroku auto-scales)
- Redis caching
- Image CDN
- Database read replicas

---

## 🔄 Backup & Recovery

### Database Backups
- Enable automatic MongoDB Atlas backups
- Keep backups for at least 30 days
- Test restore procedures

### Code Backup
- Use Git (GitHub, GitLab, Bitbucket)
- Enable branch protection
- Regular code reviews

### Disaster Recovery Plan
1. Document all credentials (secure)
2. Document deployment procedures
3. Test recovery procedures quarterly
4. Keep runbooks for common issues

---

## 📝 Pre-Deployment Checklist

- [ ] All tests passing
- [ ] No console errors or warnings
- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] CORS properly configured
- [ ] SSL certificate ready
- [ ] Domain DNS configured
- [ ] Google OAuth credentials ready
- [ ] Backups configured
- [ ] Monitoring setup
- [ ] Error tracking enabled
- [ ] Performance benchmarks noted
- [ ] Security audit completed
- [ ] Load testing done

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
```
Error: connect ECONNREFUSED
- Check connection string
- Verify IP whitelist
- Check username/password
```

### CORS Errors
```
Error: Access-Control-Allow-Origin missing
- Update CORS_ORIGIN in .env
- Restart backend
- Clear browser cache
```

### API Timeout
```
Slow responses
- Check database indexes
- Optimize queries
- Enable caching
- Scale up resources
```

---

## 📞 Support Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Heroku Documentation](https://devcenter.heroku.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [Google Cloud Documentation](https://cloud.google.com/docs)

---

**Last Updated:** January 2, 2026
