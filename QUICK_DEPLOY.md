# ⚡ Quick Deployment Reference

## 🎯 Quick Start (5 Minutes)

### 1. Push to GitHub (Separate Repositories)

**Backend:**
```bash
cd backend
git init
git add .
git commit -m "Initial commit: GMS Backend"
git remote add origin https://github.com/yourusername/gms-backend.git
git push -u origin main
```

**Frontend:**
```bash
cd frontend
git init
git add .
git commit -m "Initial commit: GMS Frontend"
git remote add origin https://github.com/yourusername/gms-frontend.git
git push -u origin main
```

**Note**: See [SPLIT_REPOSITORIES.md](SPLIT_REPOSITORIES.md) for detailed splitting guide.

### 2. Deploy Backend (Render)

1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect GitHub repo (`gms-backend`)
3. Settings:
   - **Root Directory**: Leave empty (repository root)
   - **Build**: `npm install`
   - **Start**: `npm start`
4. Environment Variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   CORS_ORIGIN=https://your-frontend.vercel.app (update after frontend deploy)
   ```
5. Deploy → Copy backend URL

### 3. Deploy Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import GitHub repo (`gms-frontend`)
3. Settings:
   - **Root Directory**: Leave empty (repository root)
   - **Framework**: Vite
   - **Build**: `npm run build`
4. Environment Variables:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com/api
   VITE_API_SERVER_URL=https://your-backend.onrender.com
   ```
5. Deploy → Copy frontend URL

### 4. Update CORS

1. Go back to Render
2. Update `CORS_ORIGIN` with your Vercel URL
3. Redeploy backend

### 5. Redeploy Frontend

1. Go to Vercel
2. Update environment variables if needed
3. Redeploy

---

## 📝 MongoDB Atlas Setup (2 Minutes)

1. [Create account](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Database Access → Add user
4. Network Access → Allow from anywhere (0.0.0.0/0)
5. Database → Connect → Copy connection string
6. Replace `<password>` and `<dbname>`

---

## 🔗 URLs You'll Need

- **Backend**: `https://your-app.onrender.com`
- **Frontend**: `https://your-app.vercel.app`
- **API Docs**: `https://your-backend.onrender.com/api/docs`
- **Health Check**: `https://your-backend.onrender.com/api/health`

---

## ✅ Post-Deployment Checklist

- [ ] Backend health check works
- [ ] Frontend loads correctly
- [ ] API calls work (check browser console)
- [ ] File uploads work (if applicable)
- [ ] CORS errors resolved
- [ ] All features tested

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| CORS error | Update `CORS_ORIGIN` in backend |
| API not found | Check `VITE_API_BASE_URL` in frontend |
| MongoDB error | Verify connection string |
| Slow first request | Render free tier spins down - wait ~30s |

---

**Full Guide**: See [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md) for detailed instructions.
