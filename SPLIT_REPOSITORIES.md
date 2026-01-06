# 🔀 Guide: Splitting Backend and Frontend into Separate Repositories

This guide will help you separate the backend and frontend into two independent GitHub repositories.

## 📋 Prerequisites

- Git installed
- GitHub account
- Both backend and frontend code ready

---

## Step 1: Prepare Backend Repository

### 1.1 Create Backend Directory Structure

The backend is already in the `backend/` folder. We'll create a separate repository for it.

### 1.2 Initialize Backend Git Repository

```bash
# Navigate to backend directory
cd backend

# Initialize git repository
git init

# Add all backend files
git add .

# Create initial commit
git commit -m "Initial commit: GMS Backend API"
```

### 1.3 Create Backend GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it: `gms-backend` (or your preferred name)
3. **Don't** initialize with README, .gitignore, or license
4. Copy the repository URL

### 1.4 Push Backend to GitHub

```bash
# Add remote origin
git remote add origin https://github.com/yourusername/gms-backend.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 2: Prepare Frontend Repository

### 2.1 Navigate to Frontend Directory

```bash
# From project root
cd frontend
```

### 2.2 Initialize Frontend Git Repository

```bash
# Initialize git repository
git init

# Add all frontend files
git add .

# Create initial commit
git commit -m "Initial commit: GMS Frontend"
```

### 2.3 Create Frontend GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it: `gms-frontend` (or your preferred name)
3. **Don't** initialize with README, .gitignore, or license
4. Copy the repository URL

### 2.4 Push Frontend to GitHub

```bash
# Add remote origin
git remote add origin https://github.com/yourusername/gms-frontend.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 3: Update Deployment Configurations

### 3.1 Backend Deployment (Render/Railway)

When deploying the backend:
- **Root Directory**: Leave empty (or set to `/`)
- **Build Command**: `npm install`
- **Start Command**: `npm start`

The backend repository is now standalone and ready for deployment.

### 3.2 Frontend Deployment (Vercel/Netlify)

When deploying the frontend:
- **Root Directory**: Leave empty (or set to `/`)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

The frontend repository is now standalone and ready for deployment.

---

## Step 4: Update Environment Variables

### 4.1 Backend Environment Variables

In your backend deployment platform (Render/Railway), set:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=https://your-frontend-url.vercel.app
API_URL=https://your-backend-url.onrender.com
```

### 4.2 Frontend Environment Variables

In your frontend deployment platform (Vercel/Netlify), set:

```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
VITE_API_SERVER_URL=https://your-backend-url.onrender.com
```

---

## Step 5: Verify Separation

### 5.1 Test Backend Repository

```bash
cd backend
git log  # Should show your commits
git remote -v  # Should show backend repository
```

### 5.2 Test Frontend Repository

```bash
cd frontend
git log  # Should show your commits
git remote -v  # Should show frontend repository
```

---

## 📁 Repository Structure After Split

### Backend Repository (`gms-backend`)
```
gms-backend/
├── models/
├── routes/
├── middleware/
├── config/
├── utils/
├── __tests__/
├── uploads/
├── index.js
├── package.json
├── .gitignore
├── README.md
├── Procfile
└── render.yaml
```

### Frontend Repository (`gms-frontend`)
```
gms-frontend/
├── src/
│   ├── pages/
│   ├── components/
│   ├── entities/
│   ├── config/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── public/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── README.md
└── vercel.json (if using Vercel)
```

---

## ✅ Benefits of Separate Repositories

1. **Independent Versioning** - Backend and frontend can have different release cycles
2. **Separate CI/CD** - Different deployment pipelines
3. **Team Collaboration** - Different teams can work on each repo
4. **Smaller Repositories** - Faster clones and operations
5. **Better Organization** - Clear separation of concerns
6. **Independent Access Control** - Different permissions per repo

---

## 🔄 Working with Separate Repositories

### Backend Development

```bash
cd gms-backend
git pull origin main
npm install
npm run dev
```

### Frontend Development

```bash
cd gms-frontend
git pull origin main
npm install
npm run dev
```

### Making Changes

1. **Backend Changes**: Commit and push to `gms-backend` repository
2. **Frontend Changes**: Commit and push to `gms-frontend` repository
3. **Deploy Independently**: Each repository deploys separately

---

## 🚨 Important Notes

1. **Environment Variables**: Make sure to set them in each deployment platform
2. **CORS Configuration**: Backend must allow frontend URL in `CORS_ORIGIN`
3. **API URLs**: Frontend must point to correct backend URL
4. **File Uploads**: Backend handles file storage, frontend just uploads
5. **Database**: Only backend needs MongoDB connection

---

## 📝 Checklist

- [ ] Backend repository created on GitHub
- [ ] Frontend repository created on GitHub
- [ ] Backend code pushed to `gms-backend`
- [ ] Frontend code pushed to `gms-frontend`
- [ ] Both repositories have README files
- [ ] Both repositories have .gitignore files
- [ ] Backend deployed to Render/Railway
- [ ] Frontend deployed to Vercel/Netlify
- [ ] Environment variables configured
- [ ] CORS configured correctly
- [ ] Everything tested and working

---

## 🆘 Troubleshooting

### Issue: "Cannot find module" errors
**Solution**: Make sure `node_modules` is in `.gitignore` and run `npm install` in each repository.

### Issue: Environment variables not working
**Solution**: Check that environment variables are set in your deployment platform, not just in `.env` files.

### Issue: CORS errors
**Solution**: Update `CORS_ORIGIN` in backend to include your frontend URL.

### Issue: API connection errors
**Solution**: Verify `VITE_API_BASE_URL` in frontend matches your backend URL.

---

## 📚 Next Steps

After splitting:
1. Update deployment guides with new repository structure
2. Set up CI/CD pipelines for each repository
3. Configure branch protection rules
4. Set up automated testing
5. Configure monitoring and alerts

---

**Last Updated**: January 6, 2026
