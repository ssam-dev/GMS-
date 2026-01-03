# Monorepo Deployment Guide

This is a monorepo with both frontend and backend in a single GitHub repository.

## Directory Structure
```
/backend  - Express.js API server
/frontend - React + Vite SPA
```

## Backend Deployment (Render)

### Prerequisites
- Render account: https://render.com
- GitHub repository connected to Render

### Setup Instructions

1. **Create a new Web Service on Render**
   - Go to https://dashboard.render.com/select-repo
   - Select your GitHub repository
   - Choose "Web Service"

2. **Configure the Service**
   - **Name**: `gms-backend` (or your preferred name)
   - **Runtime**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave blank (Render will use the repo root)

3. **Set Environment Variables**
   Add these in the Render dashboard:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Your JWT secret key
   - `NODE_ENV` - Set to `production`
   - Any other backend environment variables

4. **Deploy**
   - Every push to your main branch will trigger a new deployment

### Alternative: Using render.yaml
If you use `render.yaml` (included in this repo):
- Render will automatically detect and use the configuration
- Ensure the `rootDir: backend` is set correctly

---

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account: https://vercel.com
- GitHub repository connected to Vercel

### Setup Instructions

1. **Connect Repository to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel should detect it's using Vite

2. **Configure Project Settings**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend` ⭐ **IMPORTANT**
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Set Environment Variables**
   Add these in Vercel Project Settings → Environment Variables:
   - `VITE_API_URL` - Your backend API URL (e.g., https://your-backend.onrender.com)
   - Any other frontend environment variables

4. **Deploy**
   - Every push to your main branch will trigger a new deployment

---

## GitHub Setup

1. **Create a `.gitignore` file** (already exists)
   - Excludes `node_modules`, `.env`, build files

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Monorepo setup for Render (backend) and Vercel (frontend)"
   git push origin main
   ```

3. **Both services will auto-deploy** on push

---

## Environment Variables Reference

### Backend (.env in /backend)
```
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://your-vercel-domain.com
```

### Frontend (.env in /frontend)
```
VITE_API_URL=https://your-backend.onrender.com
VITE_APP_NAME=GMS
```

---

## Testing Deployments

### Backend Health Check
```bash
curl https://your-backend.onrender.com/health
```

### Frontend Access
Visit: `https://your-frontend.vercel.app`

---

## Troubleshooting

### Backend not deploying on Render
- Check that build logs show `cd backend && npm install` ran
- Verify MONGODB_URI and other env vars are set
- Check that port defaults to 5000 or uses `process.env.PORT`

### Frontend not deploying on Vercel
- Ensure **Root Directory** is set to `frontend`
- Check that `npm run build` generates files in `dist/`
- Verify VITE_API_URL is set correctly

### CORS Issues
- Backend CORS should allow your Vercel domain
- Update `CORS_ORIGIN` env var on Render

---

## Updating Deployments

**After pushing code:**
- Render watches your `/backend` directory
- Vercel watches your `/frontend` directory
- Both auto-deploy on changes in their respective directories

**Selective Deployments:**
If you want to prevent auto-deploys when only one part changes, use Render/Vercel's deploy hooks or branch-based deployments.
