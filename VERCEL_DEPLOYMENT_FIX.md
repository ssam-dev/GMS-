# 🔧 Vercel Deployment Fix

## ❌ Error: "cd: frontend: No such file or directory"

This error occurs when Vercel tries to build but can't find the `frontend` directory.

## ✅ Solution: Configure Root Directory in Vercel

### Option 1: Set Root Directory in Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (`GMS-`)
3. Go to **Settings** → **General**
4. Scroll to **Root Directory**
5. Click **Edit**
6. Set Root Directory to: `frontend`
7. Click **Save**
8. Go to **Deployments** tab
9. Click **Redeploy** on the latest deployment

**After setting Root Directory to `frontend`:**
- Vercel will automatically use `frontend/package.json`
- Build command will run from `frontend/` directory
- Output directory will be `frontend/dist`

### Option 2: Keep Root Directory Empty (Not Recommended)

If you don't set Root Directory, you'll need to update `vercel.json` manually:

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**⚠️ Note**: Option 1 (setting Root Directory) is much simpler and recommended.

---

## 📋 Complete Vercel Configuration

### Settings in Vercel Dashboard:

1. **Framework Preset**: Vite (auto-detected)
2. **Root Directory**: `frontend` ⭐ (IMPORTANT)
3. **Build Command**: `npm run build` (auto-detected)
4. **Output Directory**: `dist` (auto-detected)
5. **Install Command**: `npm install` (auto-detected)

### Environment Variables:

Go to **Settings** → **Environment Variables** and add:

```env
VITE_API_BASE_URL=https://gms-backend-wpxb.onrender.com/api
VITE_API_SERVER_URL=https://gms-backend-wpxb.onrender.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id (optional)
```

---

## 🔍 Verify Frontend is in Repository

To check if `frontend` is committed to GitHub:

```bash
git ls-files frontend
```

If you see files listed, the frontend is in the repository.

---

## 🚀 After Fix

1. Set Root Directory to `frontend` in Vercel
2. Add environment variables
3. Redeploy
4. Your frontend should build successfully!

---

## 📚 Related Documentation

- [NEXT_STEPS.md](NEXT_STEPS.md) - Complete deployment guide
- [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md) - Full deployment instructions
- [QUICK_DEPLOY.md](QUICK_DEPLOY.md) - Quick reference
