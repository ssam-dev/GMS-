# 🎯 Next Steps After Backend Deployment

## ✅ Backend Status

**Backend URL**: `https://gms-backend-wpxb.onrender.com`  
**Status**: ✅ Deployed and Healthy  
**Health Check**: [https://gms-backend-wpxb.onrender.com/api/health](https://gms-backend-wpxb.onrender.com/api/health)  
**API Docs**: [https://gms-backend-wpxb.onrender.com/api/docs](https://gms-backend-wpxb.onrender.com/api/docs)

---

## 📋 Step 1: Verify Backend Environment Variables

Make sure these are set in your Render dashboard:

1. Go to **Render Dashboard** → Your Service → **Environment** tab
2. Verify these variables are set:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=https://your-frontend-url.vercel.app (will update after frontend deploy)
API_URL=https://gms-backend-wpxb.onrender.com
```

**Note**: `CORS_ORIGIN` can be set to `*` temporarily for testing, but update it after frontend deployment.

---

## 🚀 Step 2: Deploy Frontend to Vercel

### 2.1 Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository
   - If using **separate frontend repo**: Import `gms-frontend` repository
   - If using **monorepo**: Set **Root Directory** to `frontend`

### 2.2 Configure Settings

**Settings:**
- **Framework Preset**: Vite (auto-detected)
- **Root Directory**: ⭐ **Set to `frontend`** (IMPORTANT - this fixes the "cd: frontend: No such file" error)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

**⚠️ Critical**: If you get "cd: frontend: No such file or directory" error, you MUST set **Root Directory** to `frontend` in Vercel settings.

📚 **Troubleshooting**: See [VERCEL_DEPLOYMENT_FIX.md](VERCEL_DEPLOYMENT_FIX.md) for detailed fix instructions.

### 2.3 Set Environment Variables

Click **Environment Variables** and add:

```env
VITE_API_BASE_URL=https://gms-backend-wpxb.onrender.com/api
VITE_API_SERVER_URL=https://gms-backend-wpxb.onrender.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id (optional, for Google OAuth)
```

**Important**: Replace with your actual backend URL if different.

### 2.4 Deploy

1. Click **Deploy**
2. Wait for deployment (~2-3 minutes)
3. Copy your frontend URL (e.g., `https://gms.vercel.app`)

---

## 🔄 Step 3: Update Backend CORS

After frontend is deployed:

1. Go to **Render Dashboard** → Your Backend Service
2. Click **Environment** tab
3. Update `CORS_ORIGIN` environment variable:
   ```
   https://your-frontend-url.vercel.app
   ```
   Replace with your actual Vercel frontend URL
4. **Save** changes
5. Render will automatically redeploy

**Alternative**: For development/testing, you can temporarily set:
```
CORS_ORIGIN=*
```
But this is less secure for production.

---

## ✅ Step 4: Test the Full Application

1. **Test Backend API**:
   - Visit: `https://gms-backend-wpxb.onrender.com/api/health`
   - Should return: `{"status":"healthy","message":"GMS API is running"}`

2. **Test Frontend**:
   - Visit your Vercel frontend URL
   - Try logging in
   - Test API calls (create member, trainer, etc.)

3. **Check Browser Console**:
   - Open browser DevTools (F12)
   - Check for any CORS errors
   - Check Network tab for API calls

---

## 🔍 Troubleshooting

### CORS Errors

If you see CORS errors in browser console:
- Verify `CORS_ORIGIN` in Render matches your frontend **base URL** exactly (no path, no trailing slash)
- Example: `https://gms-6vat7ftxe-samarth-saindanes-projects.vercel.app` (NOT `/dashboard`)
- Include protocol (`https://`) and no trailing slash
- Redeploy backend after updating
- Wait 2-3 minutes for deployment to complete

📚 **Detailed Guide**: See [CORS_TROUBLESHOOTING.md](CORS_TROUBLESHOOTING.md) for complete CORS troubleshooting.

### API Not Responding

- Check Render logs for errors
- Verify MongoDB connection string is correct
- Check that all environment variables are set

### Frontend Can't Connect to Backend

- Verify `VITE_API_BASE_URL` in Vercel matches your backend URL
- Check that backend is not sleeping (free tier sleeps after 15 min)
- First request after sleep takes ~30 seconds

---

## 📚 Useful Links

- **Backend API Docs**: [https://gms-backend-wpxb.onrender.com/api/docs](https://gms-backend-wpxb.onrender.com/api/docs)
- **Render Dashboard**: [https://dashboard.render.com](https://dashboard.render.com)
- **Vercel Dashboard**: [https://vercel.com/dashboard](https://vercel.com/dashboard)
- **Deployment Guide**: [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md)
- **Troubleshooting**: [RENDER_TROUBLESHOOTING.md](RENDER_TROUBLESHOOTING.md)

---

## 🎉 You're Almost Done!

Once frontend is deployed and CORS is updated, your GMS application will be fully live! 🚀
