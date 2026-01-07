# 🚀 Complete Deployment Guide

This guide will help you deploy your GMS application to production.

## 📋 Prerequisites

- [ ] GitHub account (for code repository)
- [ ] MongoDB Atlas account (free tier available)
- [ ] Render account (for backend) - [Sign up here](https://render.com)
- [ ] Vercel account (for frontend) - [Sign up here](https://vercel.com)

---

## Step 1: Prepare Your Code

### 1.1 Separate Repositories (Recommended)

**Note**: Backend and frontend should be in separate repositories for better organization.

See [SPLIT_REPOSITORIES.md](SPLIT_REPOSITORIES.md) for detailed instructions on splitting.

### 1.2 Push Backend to GitHub

```bash
cd backend
git init
git add .
git commit -m "Initial commit: GMS Backend"

# Create backend repository on GitHub, then:
git remote add origin https://github.com/yourusername/gms-backend.git
git branch -M main
git push -u origin main
```

### 1.3 Push Frontend to GitHub

```bash
cd frontend
git init
git add .
git commit -m "Initial commit: GMS Frontend"

# Create frontend repository on GitHub, then:
git remote add origin https://github.com/yourusername/gms-frontend.git
git branch -M main
git push -u origin main
```

---

## Step 2: Set Up MongoDB Atlas

### 2.1 Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up/Login
3. Create a new cluster (Free tier M0 is fine)
4. Wait for cluster to be created (~5 minutes)

### 2.2 Configure Database Access

1. Go to **Database Access** → **Add New Database User**
2. Create a user with username and password
3. Set role to **Atlas Admin** (or **Read and write to any database**)
4. **Save the password** - you'll need it!

### 2.3 Configure Network Access

1. Go to **Network Access** → **Add IP Address**
2. Click **Allow Access from Anywhere** (0.0.0.0/0)
3. Or add specific IPs for better security

### 2.4 Get Connection String

1. Go to **Database** → **Connect**
2. Choose **Connect your application**
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `gms` (or your preferred database name)

**Example:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gms?retryWrites=true&w=majority
```

📚 **Detailed Guide**: See [MONGODB_CONNECTION_STRING.md](MONGODB_CONNECTION_STRING.md) for connection string format, encoding, and troubleshooting.

---

## Step 3: Deploy Backend to Render

### 3.1 Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Select your `gms` repository

### 3.2 Configure Backend Service

**Settings:**
- **Name**: `gms-backend` (or your preferred name)
- **Root Directory**: 
  - If deploying from **separate backend repository**: Leave empty (repository root)
  - If deploying from **monorepo** (backend in subfolder): Set to `backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free (or paid for better performance)

**⚠️ Important**: If you get "Missing script: start" error, set **Root Directory** to `backend` in Render settings.

📚 **Troubleshooting**: See [RENDER_TROUBLESHOOTING.md](RENDER_TROUBLESHOOTING.md) for common deployment errors.

### 3.3 Set Environment Variables

Click **Environment** tab and add:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gms?retryWrites=true&w=majority
CORS_ORIGIN=https://your-frontend-url.vercel.app
API_URL=https://gms-backend.onrender.com
```

**Important:**
- Replace `MONGODB_URI` with your actual connection string
- Replace `CORS_ORIGIN` with your frontend URL (we'll get this after deploying frontend)
- `API_URL` will be your Render service URL

📚 **Detailed Guide**: See [BACKEND_ENV_VARIABLES.md](BACKEND_ENV_VARIABLES.md) for complete environment variables reference.  
🔗 **MongoDB Setup**: See [MONGODB_CONNECTION_STRING.md](MONGODB_CONNECTION_STRING.md) for connection string format details.

### 3.4 Deploy

1. Click **Create Web Service**
2. Wait for deployment (~5-10 minutes)
3. Copy your service URL (e.g., `https://gms-backend.onrender.com`)

### 3.5 Test Backend

Visit: `https://your-backend-url.onrender.com/api/health`

You should see:
```json
{"status":"ok","message":"GMS API is running","timestamp":"..."}
```

---

## Step 4: Deploy Frontend to Vercel

### 4.1 Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Select your `gms` repository

### 4.2 Configure Frontend

**Settings:**
- **Framework Preset**: Vite
- **Root Directory**: Leave empty (repository root)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

**Note**: Since frontend is in its own repository, root directory should be empty or `/`.

### 4.3 Set Environment Variables

Click **Environment Variables** and add:

```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
VITE_API_SERVER_URL=https://your-backend-url.onrender.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id (optional)
```

**Important:**
- Replace `your-backend-url.onrender.com` with your actual Render backend URL

### 4.4 Deploy

1. Click **Deploy**
2. Wait for deployment (~2-3 minutes)
3. Copy your frontend URL (e.g., `https://gms.vercel.app`)

### 4.5 Update Backend CORS

1. Go back to Render dashboard
2. Edit your backend service
3. Update `CORS_ORIGIN` environment variable:
   ```
   https://your-frontend-url.vercel.app
   ```
4. Save and redeploy

---

## Step 5: Update Frontend Environment Variables

After getting your backend URL:

1. Go to Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Update:
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
   VITE_API_SERVER_URL=https://your-backend-url.onrender.com
   ```
5. **Redeploy** the frontend

---

## Step 6: Test Your Deployment

### 6.1 Test Frontend
- Visit your Vercel URL
- Try logging in
- Test all features

### 6.2 Test Backend API
- Visit: `https://your-backend-url.onrender.com/api/docs` (Swagger docs)
- Test API endpoints
- Check file uploads

### 6.3 Common Issues

**CORS Errors:**
- Make sure `CORS_ORIGIN` in backend includes your frontend URL
- Check for trailing slashes

**API Connection Errors:**
- Verify environment variables in Vercel
- Check backend is running (visit `/api/health`)
- Check browser console for errors

**File Upload Issues:**
- Render free tier has file system limitations
- Consider using cloud storage (AWS S3, Cloudinary) for production

---

## Step 7: Optional - Custom Domain

### 7.1 Backend (Render)
1. Go to Render dashboard
2. Select your service
3. Go to **Settings** → **Custom Domains**
4. Add your domain
5. Update DNS records as instructed

### 7.2 Frontend (Vercel)
1. Go to Vercel dashboard
2. Select your project
3. Go to **Settings** → **Domains**
4. Add your domain
5. Update DNS records

### 7.3 Update Environment Variables
After setting up custom domains, update:
- Backend: `API_URL` and `CORS_ORIGIN`
- Frontend: `VITE_API_BASE_URL` and `VITE_API_SERVER_URL`

---

## 📊 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Network access configured
- [ ] Backend deployed to Render
- [ ] Backend environment variables set
- [ ] Backend health check passing
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variables set
- [ ] CORS configured correctly
- [ ] All features tested
- [ ] Custom domain configured (optional)

---

## 🔧 Environment Variables Summary

### Backend (Render)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
CORS_ORIGIN=https://your-frontend.vercel.app
API_URL=https://your-backend.onrender.com
```

📚 **Complete Reference**: See [BACKEND_ENV_VARIABLES.md](BACKEND_ENV_VARIABLES.md) for detailed explanations, examples, platform-specific instructions, and troubleshooting.

### Frontend (Vercel)
```env
VITE_API_BASE_URL=https://your-backend.onrender.com/api
VITE_API_SERVER_URL=https://your-backend.onrender.com
VITE_GOOGLE_CLIENT_ID=your_client_id (optional)
```

---

## 🆘 Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Verify all environment variables are set
- Check Render logs for errors

### Frontend can't connect to backend
- Verify `VITE_API_BASE_URL` is correct
- Check CORS settings in backend
- Test backend health endpoint directly

### File uploads not working
- Render free tier has ephemeral file system
- Files may be lost on restart
- Consider cloud storage for production

### Slow performance
- Render free tier spins down after inactivity
- First request may be slow (~30 seconds)
- Consider paid tier for better performance

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)

---

**Need Help?** Check the logs in Render and Vercel dashboards for detailed error messages.

---

**Last Updated:** January 6, 2026
