# Railway Deployment Guide for GMS

**Estimated Time:** 20-30 minutes  
**Cost:** $5/month (often free with monthly credit)  
**Status:** Ready to deploy

---

## 📋 Prerequisites

Before starting, ensure you have:

### ✅ Required Accounts
- [ ] GitHub account (free)
- [ ] Railway account (railway.app - free to create)
- [ ] Code pushed to GitHub repository

### ✅ Check Your Project Structure
```
GMS/
├── frontend/          ← React app
├── backend/           ← Express server
├── package.json       ← Root package.json
└── README.md
```

---

## 🚀 Step 1: Create Railway Account

1. Go to **railway.app**
2. Click **"Sign up"**
3. Choose **GitHub sign-in** (recommended)
4. Authorize Railway to access your GitHub

**Time:** 2 minutes

---

## 🚀 Step 2: Push Your Code to GitHub

If not already done, push your GMS project:

```powershell
# In your project directory
git init
git add .
git commit -m "GMS ready for production"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/GMS.git
git push -u origin main
```

**Replace:** `YOUR_USERNAME` with your GitHub username

---

## 🚀 Step 3: Create Railway Project

1. Go to **railway.app/dashboard**
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Search for **"GMS"** repository
5. Click **"Import"**

---

## 🚀 Step 4: Add Backend Service

### 4.1 Configure Backend

1. In Railway dashboard, click **"New Service"**
2. Select **"GitHub Repo"**
3. Choose your **GMS** repo
4. Name it: **`gms-backend`**
5. Set **Root Directory** to: `/backend`

### 4.2 Set Environment Variables

Click on the `gms-backend` service → **Variables** tab:

```
NODE_ENV=production
MONGODB_URI=${{Mongo.MONGODB_URI}}
PORT=5000
CORS_ORIGIN=https://your-frontend-url.railway.app
```

**Note:** `${{Mongo.MONGODB_URI}}` will auto-populate after adding MongoDB

### 4.3 Set Build Command

Go to **Deploy** tab:
- **Build Command:** `cd backend && npm install`
- **Start Command:** `cd backend && npm start`

---

## 🚀 Step 5: Add Frontend Service

### 5.1 Configure Frontend

1. Click **"New Service"**
2. Select **"GitHub Repo"**
3. Choose your **GMS** repo
4. Name it: **`gms-frontend`**
5. Set **Root Directory** to: `/frontend`

### 5.2 Set Environment Variables

Click on `gms-frontend` service → **Variables** tab:

```
VITE_API_BASE_URL=https://your-backend-url.railway.app/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
```

### 5.3 Set Build Command

Go to **Deploy** tab:
- **Build Command:** `cd frontend && npm install && npm run build`
- **Start Command:** `npm run preview` (or use default Node server)

---

## 🚀 Step 6: Add MongoDB Database

### 6.1 Add MongoDB Plugin

1. In Railway dashboard, click **"+ Add"**
2. Select **"MongoDB"** from marketplace
3. Railway creates a free MongoDB instance
4. Copy the connection string (auto-added to `MONGODB_URI`)

**What happens:**
- Railway automatically creates: `Mongo.MONGODB_URI`
- This is injected into your backend environment
- Your backend connects automatically

---

## 🚀 Step 7: Connect Services

### 7.1 Link Backend to MongoDB

1. Click **`gms-backend`** service
2. Go to **Variables** tab
3. Verify `MONGODB_URI=${{Mongo.MONGODB_URI}}` exists

### 7.2 Link Frontend to Backend

1. Click **`gms-frontend`** service
2. Go to **Variables** tab
3. Update `VITE_API_BASE_URL`:

```
VITE_API_BASE_URL=https://gms-backend.up.railway.app/api
```

(Use the actual backend URL from Railway dashboard)

---

## 🚀 Step 8: Deploy

### 8.1 Manual Deploy (First Time)

1. Go to **`gms-backend`** → **Deploy** tab
2. Click **"Deploy"** button
3. Wait for build completion (2-3 minutes)
4. Check logs for errors
5. Repeat for **`gms-frontend`**

### 8.2 Auto-Deploy (On Git Push)

Once deployed:
- Any `git push` to main triggers auto-deployment
- Railway rebuilds and deploys automatically
- No manual steps needed

---

## ✅ Step 9: Verify Deployment

### 9.1 Check Backend

```
https://gms-backend.up.railway.app/api/health
```

Should return:
```json
{"status": "ok"}
```

### 9.2 Check Swagger Docs

```
https://gms-backend.up.railway.app/api/docs
```

Should show interactive API documentation

### 9.3 Check Frontend

```
https://gms-frontend.up.railway.app
```

Should load your React app

### 9.4 Test Login

1. Open frontend URL
2. Log in with demo credentials:
   - Email: `admin@gym.com`
   - Password: `admin123`
3. Test member/trainer/equipment creation

---

## 🔧 Environment Variables Reference

### Backend (`gms-backend`)
```env
NODE_ENV=production
MONGODB_URI=<auto-filled by Railway>
PORT=5000
CORS_ORIGIN=https://gms-frontend.up.railway.app
```

### Frontend (`gms-frontend`)
```env
VITE_API_BASE_URL=https://gms-backend.up.railway.app/api
VITE_GOOGLE_CLIENT_ID=your-client-id (optional, test mode works without)
```

---

## 📊 What Railway Provides

| Resource | Amount | Cost |
|----------|--------|------|
| Build minutes/month | 500 | Included |
| RAM per service | 1GB | Included |
| Storage | 10GB/MongoDB | Included |
| Bandwidth | 100GB/month | Included |
| Services | Unlimited | Included |

**Monthly Credit:** $5 (usually covers small apps for free)

---

## 🐛 Troubleshooting

### Build Fails
**Error:** "npm: command not found"
- **Solution:** Check **Root Directory** is set correctly (`/backend` or `/frontend`)

### Backend Connection Fails
**Error:** "Cannot connect to MongoDB"
- **Solution:** Verify `MONGODB_URI` is set in backend variables
- Check MongoDB is actually deployed (see Services list)

### CORS Errors
**Error:** "No 'Access-Control-Allow-Origin' header"
- **Solution:** Update backend `CORS_ORIGIN` variable to match frontend URL
- Restart backend service

### Image Uploads Not Working
**Error:** "404 /uploads/equipment/..."
- **Solution:** Images are stored in Railway container (ephemeral)
- For persistent storage, use AWS S3 or Cloudinary (future upgrade)

### API URL Not Found
**Error:** Frontend gets 404 errors
- **Solution:** Verify `VITE_API_BASE_URL` matches actual backend URL
- Check both services are deployed and running

---

## 🔐 Security Checklist

Before going live:

- [ ] `NODE_ENV=production` set in backend
- [ ] `CORS_ORIGIN` restricted to your frontend domain
- [ ] MongoDB password is auto-generated by Railway (secure)
- [ ] Rate limiting enabled (already in code)
- [ ] Helmet security headers enabled (already in code)
- [ ] No hardcoded secrets in code
- [ ] Error messages sanitized in production

---

## 📈 Monitoring & Logs

### View Logs
1. Click service (e.g., `gms-backend`)
2. Go to **Logs** tab
3. See real-time output

### Monitor Performance
1. Click service
2. Go to **Metrics** tab
3. View CPU, RAM, request count

### Set Up Alerts
1. Go to **Settings** → **Notifications**
2. Enable email alerts for deployment failures

---

## 🚀 Next Steps After Deployment

### 1. Configure Custom Domain (Optional)
1. Buy domain (Namecheap, GoDaddy, etc.)
2. In Railway, go to **Settings** → **Domains**
3. Add custom domain
4. Follow DNS setup instructions

Example:
```
gms.yourdomain.com → frontend
api.gms.yourdomain.com → backend
```

### 2. Enable Google OAuth (Production)
1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Set authorized origins to your Railway domains
4. Add `VITE_GOOGLE_CLIENT_ID` to frontend variables

### 3. Set Up Error Monitoring
- Add **Sentry** for error tracking
- Add **LogRocket** for session replay
- Both have free tiers

### 4. Database Backups
1. In Railway, click **MongoDB** service
2. Go to **Settings**
3. Enable automatic backups

---

## 💡 Pro Tips

### Tip 1: Local Testing Before Deploy
Test locally with production variables:
```bash
NODE_ENV=production npm start
```

### Tip 2: View Real-Time Logs
```bash
# Terminal command to stream logs
railway logs --service gms-backend
```

### Tip 3: Rollback Deployment
If something breaks:
1. Click service → **Deployments** tab
2. Select previous successful deployment
3. Click **Redeploy**

### Tip 4: Environment-Specific Variables
Create different variables for staging vs production:
```
MONGODB_URI_DEV=<local>
MONGODB_URI_PROD=${{Mongo.MONGODB_URI}}
```

---

## 📞 Support

### Railway Documentation
- https://docs.railway.app
- https://railway.app/status (uptime)

### Your Project
- Backend: `https://gms-backend.up.railway.app`
- Frontend: `https://gms-frontend.up.railway.app`
- API Docs: `https://gms-backend.up.railway.app/api/docs`

---

## ✅ Final Checklist

Before declaring deployment complete:

- [ ] GitHub repo created and code pushed
- [ ] Railway account created
- [ ] Backend service deployed successfully
- [ ] Frontend service deployed successfully
- [ ] MongoDB service running
- [ ] Environment variables configured
- [ ] `/api/health` endpoint returns OK
- [ ] Frontend loads in browser
- [ ] Login works with demo credentials
- [ ] Can create members/trainers/equipment
- [ ] Logs show no errors

---

## 🎉 You're Live!

Once all checks pass, your GMS application is **live in production**!

**Deployment URLs:**
- Frontend: https://gms-frontend.up.railway.app
- Backend API: https://gms-backend.up.railway.app/api
- API Documentation: https://gms-backend.up.railway.app/api/docs

**What's Running:**
✅ React frontend with Vite  
✅ Express.js backend with security  
✅ MongoDB database with indexes  
✅ Image upload capability  
✅ Authentication system  
✅ Rate limiting & logging  

**Cost:** ~$5/month (usually covered by Railway credits)

---

**Happy Deploying! 🚀**

For questions, refer to Railway docs or contact Railway support.
