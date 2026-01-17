# 🚀 Production Deployment Checklist

## ✅ Code Ready
- [x] Error handling with proper user notifications (toast messages)
- [x] API client with validation error handling
- [x] Sensitive data masked in backend logs
- [x] No console.log statements logging sensitive data in production
- [x] Environment variables for API URLs configured
- [x] CORS configuration set up with environment variables
- [x] Edit modals close properly before opening forms

## ⚠️ Required Before Deployment

### 1. Environment Variables

#### Backend (.env on Render/Railway/Heroku)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
CORS_ORIGIN=https://your-frontend.vercel.app
```

**Critical**: Update `CORS_ORIGIN` with your actual Vercel frontend URL!

#### Frontend (.env on Vercel/Netlify)
```env
VITE_API_BASE_URL=https://your-backend.onrender.com/api
VITE_API_SERVER_URL=https://your-backend.onrender.com
```

**Critical**: Update with your actual backend URL!

### 2. MongoDB Atlas Setup
- [ ] Create MongoDB Atlas account
- [ ] Create cluster
- [ ] Create database user
- [ ] Whitelist IP addresses (0.0.0.0/0 for cloud platforms)
- [ ] Get connection string
- [ ] Set MONGODB_URI in backend environment

### 3. Backend Deployment
- [ ] Push code to GitHub
- [ ] Connect repository to Render/Railway/Heroku
- [ ] Set all environment variables
- [ ] Deploy backend
- [ ] Test API endpoint: `https://your-backend.onrender.com/api/health`
- [ ] Verify backend logs show no errors

### 4. Frontend Deployment
- [ ] Set backend API URLs in environment variables
- [ ] Deploy to Vercel/Netlify
- [ ] Get frontend URL
- [ ] **Update CORS_ORIGIN in backend with this URL**
- [ ] Redeploy backend after updating CORS_ORIGIN

### 5. Post-Deployment Testing
- [ ] Test login functionality
- [ ] Test adding/editing/deleting members
- [ ] Test adding/editing/deleting trainers
- [ ] Test adding/editing/deleting equipment
- [ ] Test image uploads
- [ ] Test pagination and filters
- [ ] Check browser console for errors
- [ ] Verify no CORS errors

## 🔧 Common Issues & Fixes

### Issue: CORS Error
**Symptom**: "Access to fetch has been blocked by CORS policy"

**Fix**:
1. Go to backend deployment platform (Render dashboard)
2. Open Environment variables
3. Update `CORS_ORIGIN` to exact frontend URL:
   ```
   https://your-frontend.vercel.app
   ```
4. Save and wait for redeploy (2-3 minutes)

### Issue: API Calls Failing
**Symptom**: Network errors or 404 on API calls

**Fix**:
1. Check frontend environment variables
2. Verify `VITE_API_BASE_URL` and `VITE_API_SERVER_URL` are correct
3. Test backend health endpoint directly in browser
4. Check backend logs for errors

### Issue: Images Not Loading
**Symptom**: Broken image icons

**Fix**:
1. Verify `VITE_API_SERVER_URL` includes the base URL (no `/api`)
2. Check that uploaded images are in backend uploads folder
3. Verify backend serves static files from `/uploads` path

### Issue: MongoDB Connection Failed
**Symptom**: Backend logs show MongoDB connection errors

**Fix**:
1. Verify MONGODB_URI is correct (includes username, password, cluster)
2. Check MongoDB Atlas network access whitelist
3. Ensure IP 0.0.0.0/0 is whitelisted for cloud deployments

## 📊 Deployment Status

| Component | Status | URL |
|-----------|--------|-----|
| Backend | ⏳ Needs CORS config | `https://your-backend.onrender.com` |
| Frontend | ⏳ Needs env vars | `https://your-frontend.vercel.app` |
| MongoDB | ⏳ Needs setup | MongoDB Atlas |

## 🎯 Quick Deploy Steps

1. **Deploy Backend First**:
   ```bash
   # Push to GitHub
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   
   # Then connect GitHub repo to Render
   # Set environment variables
   # Deploy
   ```

2. **Get Backend URL**: Copy from Render dashboard

3. **Deploy Frontend**:
   - Set `VITE_API_BASE_URL` and `VITE_API_SERVER_URL`
   - Deploy to Vercel

4. **Update CORS**: 
   - Copy frontend URL from Vercel
   - Update `CORS_ORIGIN` in Render backend
   - Wait for redeploy

5. **Test Everything**: Visit frontend and test all features

## 📚 Additional Resources

- [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md) - Complete deployment guide
- [CORS_TROUBLESHOOTING.md](CORS_TROUBLESHOOTING.md) - CORS error fixes
- [DEPLOYMENT_READY.md](DEPLOYMENT_READY.md) - Pre-deployment info

---

**Ready to Deploy?** Follow the steps above and update this checklist as you complete each item!
