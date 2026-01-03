# 🚀 Fly.io Deployment Guide - Complete Steps

**Estimated Time:** 15 minutes  
**Cost:** Free (with $3/month credit)  
**Difficulty:** Easy ⭐⭐

---

## 📋 Prerequisites

✅ GitHub account (already have it)  
✅ Code on GitHub (already done - ssam-dev/GMS-)  
✅ MongoDB Atlas URL (already have it)  

---

## Step 1: Install Flyctl CLI

This is the tool that lets you deploy to Fly.io from your computer.

### For Windows:

**Option A: Using Chocolatey (if installed)**
```powershell
choco install flyctl
```

**Option B: Direct Download**
1. Go to **fly.io/docs/getting-started/installing-flyctl/**
2. Download Windows installer
3. Run the installer
4. Restart PowerShell

### Verify Installation
```powershell
flyctl version
```

Should show something like: `Fly CLI v0.X.X`

---

## Step 2: Sign In to Fly.io

```powershell
flyctl auth login
```

**What happens:**
1. Browser opens automatically
2. Sign up with GitHub account
3. Authorize Fly.io
4. You'll see confirmation in terminal

---

## Step 3: Navigate to Your Project

```powershell
cd c:\Users\samar\OneDrive\Desktop\GMS
```

---

## Step 4: Launch Fly App

This command sets up your app on Fly.io:

```powershell
flyctl launch
```

**You'll be asked questions:**

### Question 1: "App Name?"
```
Enter app name: gms-app
```
(Or any name you want - will be part of URL)

### Question 2: "Select Organization"
```
Just press Enter (select default)
```

### Question 3: "Would you like to set up a Postgresql database now?"
```
Type: n
(No - we use MongoDB Atlas instead)
```

### Question 4: "Would you like to deploy now?"
```
Type: n
(Not yet - we need to configure first)
```

**Result:** Creates `fly.toml` file in your project

---

## Step 5: Configure fly.toml

Open the `fly.toml` file that was created.

**Find this section:**
```toml
[build]
builder = "heroku"
```

**Change to:**
```toml
[build]
builder = "docker"
```

**Then add this section at the end:**
```toml
[[processes]]
type = "app"
cmd = "cd backend && npm start"

[[services]]
internal_port = 5000
protocol = "tcp"

[[services.ports]]
port = 80
handlers = ["http"]

[[services.ports]]
port = 443
handlers = ["tls", "http"]
```

**Save the file**

---

## Step 6: Create Dockerfile

Create a new file called `Dockerfile` in your project root:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY . .

WORKDIR /app/backend
RUN npm install

EXPOSE 5000

CMD ["npm", "start"]
```

**Where to create:** `c:\Users\samar\OneDrive\Desktop\GMS\Dockerfile`

---

## Step 7: Add Environment Variables

Set your MongoDB URI on Fly.io:

```powershell
flyctl secrets set MONGODB_URI="mongodb+srv://s6384222_db_user:Samarth21%23@cluster0.tn0bgql.mongodb.net/gms"
```

Also set:
```powershell
flyctl secrets set NODE_ENV="production"
flyctl secrets set PORT="5000"
```

---

## Step 8: Deploy Backend

Deploy your backend:

```powershell
flyctl deploy
```

**What happens:**
1. Fly.io builds your Docker image
2. Uploads to Fly.io servers
3. Starts your app
4. Shows logs in real-time

**Wait for:** "Monitoring Deployment" → "PASSED" ✅

**Result:** Your backend URL
```
https://gms-app.fly.dev
```

---

## Step 9: Test Backend

Check if it's working:

```powershell
curl https://gms-app.fly.dev/api/health
```

Should return:
```json
{"status": "ok"}
```

Or visit in browser:
```
https://gms-app.fly.dev/api/health
```

---

## Step 10: Deploy Frontend

Frontend is separate on Fly.io too. Create another app:

```powershell
flyctl apps create gms-frontend
```

---

## Step 11: Configure Frontend Dockerfile

Create `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json .

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
```

**Save to:** `c:\Users\samar\OneDrive\Desktop\GMS\frontend\Dockerfile`

---

## Step 12: Create fly.toml for Frontend

Create `frontend/fly.toml`:

```toml
app = "gms-frontend"
primary_region = "iad"

[build]
builder = "docker"
dockerfile = "Dockerfile"

[services]
internal_port = 3000
protocol = "tcp"

[[services.ports]]
port = 80
handlers = ["http"]

[[services.ports]]
port = 443
handlers = ["tls", "http"]
```

**Save to:** `c:\Users\samar\OneDrive\Desktop\GMS\frontend\fly.toml`

---

## Step 13: Update Frontend API URL

Update `frontend/src/config/auth.js` or environment:

Find this line in your frontend config:
```javascript
const API_URL = "http://localhost:5000/api"
```

Change to:
```javascript
const API_URL = "https://gms-app.fly.dev/api"
```

(Replace `gms-app` with your actual backend app name)

---

## Step 14: Deploy Frontend

```powershell
cd frontend
flyctl deploy --app gms-frontend
```

**Wait for:** Build complete ✅

**Result:** Your frontend URL
```
https://gms-frontend.fly.dev
```

---

## Step 15: Verify Everything Works

1. **Visit Frontend:**
   ```
   https://gms-frontend.fly.dev
   ```

2. **Test Login:**
   - Email: `admin@gym.com`
   - Password: `admin123`

3. **Check API Docs:**
   ```
   https://gms-app.fly.dev/api/docs
   ```

4. **Test Create Member:**
   - Create a new member from frontend
   - Should appear in database ✅

---

## 🎉 Your App is Live!

**Frontend:** https://gms-frontend.fly.dev  
**Backend:** https://gms-app.fly.dev  
**API Docs:** https://gms-app.fly.dev/api/docs  

---

## 📝 Useful Commands

### View Logs
```powershell
flyctl logs --app gms-app
```

### SSH into App
```powershell
flyctl ssh console --app gms-app
```

### Update Environment Variables
```powershell
flyctl secrets set VARIABLE_NAME="value" --app gms-app
```

### Redeploy
```powershell
flyctl deploy --app gms-app
```

---

## 🐛 Troubleshooting

### Build fails
```powershell
flyctl logs --app gms-app
```
Check the logs for errors

### Can't connect to backend
- Verify `MONGODB_URI` is set
- Check backend logs
- Ensure `/api/health` works

### Frontend shows blank page
- Check browser console for errors
- Verify `VITE_API_BASE_URL` is correct
- Check frontend logs

---

## ✅ Checklist

- [ ] Flyctl installed
- [ ] Logged in to Fly.io
- [ ] Backend app deployed
- [ ] Backend health check works
- [ ] Frontend app deployed
- [ ] Frontend loads in browser
- [ ] Login works
- [ ] Can create members
- [ ] All working! 🎉

---

## 🚀 Next Steps (Optional)

1. **Custom Domain:**
   ```powershell
   flyctl certs create your-domain.com --app gms-app
   ```

2. **Scale Up:**
   ```powershell
   flyctl scale count 2 --app gms-app
   ```

3. **Monitor:**
   - Go to dashboard.fly.io
   - See real-time metrics

---

**You did it! Your app is now live on Fly.io!** 🎉

Total cost: $0 (with free tier)

Questions? Check fly.io/docs or the logs!
