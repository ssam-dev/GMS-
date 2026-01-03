# 🚀 Vercel + Cyclic Deployment Guide

**Estimated Time:** 20 minutes  
**Cost:** $0 (completely free forever)  
**Difficulty:** Super Easy ⭐⭐

---

## 📋 What You'll Get

- **Frontend:** https://gms-frontend.vercel.app
- **Backend:** https://gms-backend.cyclic.app
- **Database:** MongoDB Atlas (free tier)

---

## 🎨 PART 1: Deploy Frontend on Vercel

### Step 1: Go to Vercel

1. Open browser
2. Go to **vercel.com**
3. Click **"Sign Up"**
4. Click **"Continue with GitHub"**
5. Authorize Vercel

### Step 2: Create New Project

1. Click **"New Project"** (or + button)
2. Click **"Import Git Repository"**
3. Search for: `GMS-`
4. Click **"Import"**

### Step 3: Configure Project

**Project Name:** (leave as is or change to `gms-frontend`)

**Framework Preset:** Vite (should auto-detect)

**Root Directory:** `/frontend` ← **IMPORTANT!**

Click **"Deploy"**

### Step 4: Wait for Deployment

- Vercel builds your app (1-2 minutes)
- Shows "Deployment Complete" ✅
- You'll get URL: `https://gms-frontend.vercel.app`

### Step 5: Add Environment Variable

1. Click **"Settings"** tab
2. Click **"Environment Variables"**
3. Add:
   ```
   NAME: VITE_API_BASE_URL
   VALUE: https://gms-backend.cyclic.app/api
   ```
4. Click **"Save"**
5. Redeploy (click "Deployments" → "Redeploy")

---

## 🔧 PART 2: Deploy Backend on Cyclic

### Step 1: Go to Cyclic

1. Open browser
2. Go to **cyclic.sh**
3. Click **"Deploy"** button (top right)
4. Click **"GitHub"**
5. Authorize Cyclic with GitHub

### Step 2: Select Repository

1. Search for: `GMS-`
2. Click your `GMS-` repository
3. Click **"Connect"**

### Step 3: Configure App

**App Name:** `gms-backend` (or any name)

**Root Directory:** `/backend` ← **IMPORTANT!**

**Build Command:** `npm install`

**Start Command:** `npm start`

Click **"Next"**

### Step 4: Add Environment Variables

Click **"Advanced"** or **"Environment Variables"**

Add these 3 variables:

```
MONGODB_URI
mongodb+srv://s6384222_db_user:Samarth21%23@cluster0.tn0bgql.mongodb.net/gms

NODE_ENV
production

PORT
5000
```

Click **"Deploy"**

### Step 5: Wait for Deployment

- Cyclic builds your app (2-3 minutes)
- Shows "Deployed" ✅
- You'll get URL: `https://gms-backend.cyclic.app`

---

## ✅ Verify Everything Works

### Test Backend

Visit:
```
https://gms-backend.cyclic.app/api/health
```

Should return:
```json
{"status": "ok"}
```

### Test Frontend

Visit:
```
https://gms-frontend.vercel.app
```

Should load your gym app ✅

### Test Login

- Email: `admin@gym.com`
- Password: `admin123`

Should log in successfully ✅

### Test Create Member

1. Log in
2. Go to "Members"
3. Click "Add Member"
4. Fill in details
5. Click "Save"
6. Should appear in list ✅

---

## 🎯 Your Live URLs

| Service | URL |
|---------|-----|
| **Frontend** | https://gms-frontend.vercel.app |
| **Backend** | https://gms-backend.cyclic.app |
| **API Docs** | https://gms-backend.cyclic.app/api/docs |

---

## 📝 Update Frontend API URL

If backend URL is different, update it:

1. Go to **Vercel Dashboard**
2. Select **gms-frontend** project
3. Click **"Settings"**
4. Click **"Environment Variables"**
5. Update `VITE_API_BASE_URL` with correct backend URL
6. **Redeploy** the project

---

## 🐛 Troubleshooting

### Frontend shows blank page
- Check browser console (F12)
- Check Vercel logs
- Verify `VITE_API_BASE_URL` is correct

### Backend returns 502 error
- Check Cyclic logs
- Verify `MONGODB_URI` is set
- Check MongoDB Atlas cluster is active

### Can't login
- Check network tab in browser
- Verify backend is responding
- Check MongoDB connection

### Images not loading
- Verify backend is running
- Check `/uploads` folder exists
- Check image paths in database

---

## ✅ Deployment Checklist

- [ ] Vercel account created
- [ ] Frontend imported from GitHub
- [ ] Frontend deployed successfully
- [ ] Frontend URL works
- [ ] Cyclic account created
- [ ] Backend imported from GitHub
- [ ] Environment variables added
- [ ] Backend deployed successfully
- [ ] `/api/health` endpoint works
- [ ] Frontend loads
- [ ] Can log in
- [ ] Can create members
- [ ] All working! 🎉

---

## 🚀 Next Steps

1. **Automatic Deployments:**
   - Both Vercel and Cyclic auto-deploy when you push to GitHub
   - Just commit and push changes

2. **Custom Domain (Optional):**
   - Vercel: Settings → Domains
   - Cyclic: Settings → Domain

3. **Monitor Performance:**
   - Vercel: Deployments tab
   - Cyclic: Dashboard

---

## 💰 Cost

**Total Cost: $0/month**

- Vercel free tier: ✅ Free
- Cyclic free tier: ✅ Free
- MongoDB Atlas free tier: ✅ Free (512MB)

---

## 🎉 You're Done!

Your GMS app is now **live and accessible worldwide!**

**Share your links:**
- Frontend: https://gms-frontend.vercel.app
- Backend API: https://gms-backend.cyclic.app/api

**Total Setup Time:** ~20 minutes  
**Total Cost:** $0  
**Result:** Production-ready app! 🎉

---

## 📞 Need Help?

- **Vercel Docs:** vercel.com/docs
- **Cyclic Docs:** docs.cyclic.sh
- **MongoDB Atlas:** mongodb.com/docs

**You did it!** 🚀
