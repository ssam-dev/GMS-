# ⚠️ Railway Build Error - SOLUTION

## The Problem

Railway detected a monorepo structure (frontend + backend) and doesn't know how to build it automatically. You need to **manually configure each service** in Railway.

---

## ✅ Solution: Set Up Services Separately in Railway

### Step 1: Delete Current Deployment
1. Go to your Railway project dashboard
2. Click **"Settings"** (bottom left)
3. Click **"Danger Zone"**
4. Click **"Delete Project"**
5. Confirm deletion

---

### Step 2: Create New Project from GitHub

1. Go to **railway.app**
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose **"GMS-"** repository

---

### Step 3: Add Backend Service (IMPORTANT!)

1. Click **"Add Service"** 
2. Select **"GitHub Repo"**
3. Choose **"GMS-"** repository
4. Set **Service name:** `gms-backend`
5. Set **Root directory:** `/backend` ← **CRITICAL**
6. Click **"Deploy"**

**In the Backend Service:**
- Go to **"Deploy"** tab
- **Build Command:** `npm install`
- **Start Command:** `npm start`

---

### Step 4: Add Frontend Service

1. Click **"+ Add Service"**
2. Select **"GitHub Repo"**
3. Choose **"GMS-"** repository
4. Set **Service name:** `gms-frontend`
5. Set **Root directory:** `/frontend` ← **CRITICAL**
6. Click **"Deploy"**

**In the Frontend Service:**
- Go to **"Deploy"** tab
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run preview`

---

### Step 5: Add MongoDB Service

1. Click **"+ Add"**
2. Search for **"MongoDB"**
3. Click **"MongoDB"** from marketplace
4. Click **"Add"**

Railway automatically creates MongoDB and provides `MONGODB_URI`

---

### Step 6: Configure Environment Variables

#### For Backend Service (`gms-backend`)

1. Click on **`gms-backend`** service
2. Go to **"Variables"** tab
3. Add these variables:

```
NODE_ENV=production
MONGODB_URI=${{Mongo.MONGODB_URI}}
PORT=5000
```

#### For Frontend Service (`gms-frontend`)

1. Click on **`gms-frontend`** service
2. Go to **"Variables"** tab
3. Add these variables:

```
VITE_API_BASE_URL=https://gms-backend.up.railway.app/api
```

---

### Step 7: Deploy

1. All services should automatically start deploying
2. Wait for green ✅ checkmarks on all services
3. Check logs for any errors

---

## 🔍 Verify Deployment

### Check Backend Health

```
https://gms-backend.up.railway.app/api/health
```

Should return:
```json
{"status": "ok"}
```

### Check Frontend

```
https://gms-frontend.up.railway.app
```

Should load your React app

### Check API Docs

```
https://gms-backend.up.railway.app/api/docs
```

Should show Swagger documentation

---

## 🐛 If Still Getting Build Errors

### Issue: "Nixpacks unable to generate build plan"

**Causes:**
1. Root directory not set correctly
2. Service using wrong package.json
3. Missing Node.js detection

**Solutions:**

**A. Explicitly Set Build Command**

For each service, go to **Deploy** tab and set:

- **Build Command:** `npm install`
- **Start Command:** For backend: `npm start`, For frontend: `npm run preview`

**B. Verify Root Directory**

For each service:
1. Go to **Settings** tab
2. Find **"Root Directory"**
3. Verify it's set to `/backend` or `/frontend`
4. Save and redeploy

**C. Check package.json Exists**

Verify:
- `/backend/package.json` exists ✓
- `/frontend/package.json` exists ✓
- Both have `"scripts"` section with `"start"` command

---

## ✅ Correct Structure for Railway

```
GMS/
├── backend/
│   ├── package.json          ← Has "start" script
│   ├── index.js
│   ├── routes/
│   ├── models/
│   └── ...
├── frontend/
│   ├── package.json          ← Has "build" and "preview" scripts
│   ├── src/
│   ├── index.html
│   └── ...
└── docs/
    └── ...
```

**Each service needs its own `package.json` with proper scripts** ✓

---

## 📋 Quick Checklist

- [ ] Delete old Railway project
- [ ] Create new project from GitHub
- [ ] Add Backend service with root directory `/backend`
- [ ] Add Frontend service with root directory `/frontend`
- [ ] Add MongoDB service
- [ ] Set environment variables for both services
- [ ] All services show green ✅ checkmarks
- [ ] Backend health check returns OK
- [ ] Frontend loads in browser
- [ ] Login works

---

## 💡 Why This Happens

Railway's Nixpacks is a language/framework auto-detector. It looks at the root directory and tries to figure out what to build. When it sees a monorepo with separate frontend/backend, it gets confused.

By explicitly setting the **root directory for each service**, you tell Railway exactly where each app is located, and it can properly detect Node.js and build each one independently.

---

## 🚀 After Setup

Once all three services are deployed and running:

1. **Frontend URL:** `https://gms-frontend.up.railway.app`
2. **Backend URL:** `https://gms-backend.up.railway.app`
3. **Database:** Managed by Railway (connected via MONGODB_URI)

Your app is live! 🎉

---

**Need help? Follow the steps above exactly as listed.** Each step is critical for proper deployment.
