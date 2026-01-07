# 🔧 Render Deployment Troubleshooting

## Common Errors and Solutions

### ❌ Error: "Missing script: start"

**Error Message:**
```
npm error Missing script: "start"
```

**Cause:**
Render is trying to run `npm start` from the wrong directory (repository root instead of `backend/` folder).

**Solution:**

#### Option 1: Set Root Directory in Render Dashboard (Recommended)

1. Go to your Render service dashboard
2. Click on **Settings** tab
3. Scroll to **Build & Deploy** section
4. Set **Root Directory** to: `backend`
5. Save changes
6. Click **Manual Deploy** → **Deploy latest commit**

#### Option 2: Deploy from Separate Backend Repository

If you're using a monorepo, create a separate backend repository:

1. Create a new GitHub repository for backend only
2. Push backend code to that repository
3. Connect that repository to Render
4. Leave **Root Directory** empty (or `/`)
5. Deploy

See [SPLIT_REPOSITORIES.md](SPLIT_REPOSITORIES.md) for detailed instructions.

#### Option 3: Update Build/Start Commands

If you can't change root directory, update commands in Render dashboard:

- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`

---

### ❌ Error: "Cannot find module" or "Module not found"

**Cause:**
Dependencies not installed or wrong Node version.

**Solution:**

1. Check **Node Version** in Render settings (should be 18.x or 20.x)
2. Ensure **Build Command** is: `npm install` (or `cd backend && npm install`)
3. Check that `package.json` exists in the root directory Render is using

---

### ❌ Error: "MongoDB connection failed"

**Cause:**
- Incorrect `MONGODB_URI` format
- Network access not configured in MongoDB Atlas
- Environment variable not set

**Solution:**

1. **Check MongoDB Atlas Network Access:**
   - Go to MongoDB Atlas → Network Access
   - Add `0.0.0.0/0` (allow all IPs) or Render's IP ranges

2. **Verify Connection String:**
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`
   - URL encode special characters (e.g., `#` becomes `%23`)
   - See [MONGODB_CONNECTION_STRING.md](MONGODB_CONNECTION_STRING.md)

3. **Check Environment Variables:**
   - Go to Render → Environment tab
   - Verify `MONGODB_URI` is set correctly
   - No extra quotes or spaces

---

### ❌ Error: "CORS policy" or "Access-Control-Allow-Origin"

**Cause:**
Frontend URL not added to `CORS_ORIGIN` environment variable.

**Solution:**

1. Get your frontend URL (e.g., `https://your-app.vercel.app`)
2. Go to Render → Environment tab
3. Update `CORS_ORIGIN` to your frontend URL
4. Redeploy backend

---

### ❌ Error: "Port already in use" or "EADDRINUSE"

**Cause:**
Render automatically assigns a port via `PORT` environment variable.

**Solution:**

1. In `backend/index.js`, ensure you're using:
   ```javascript
   const PORT = process.env.PORT || 5000;
   ```

2. Don't hardcode the port - Render sets `PORT` automatically

---

### ❌ Error: Build succeeds but service won't start

**Possible Causes:**
- Missing environment variables
- Database connection failing
- Syntax errors in code

**Solution:**

1. **Check Logs:**
   - Go to Render → Logs tab
   - Look for error messages

2. **Check Environment Variables:**
   - Verify all required variables are set
   - See [BACKEND_ENV_VARIABLES.md](BACKEND_ENV_VARIABLES.md)

3. **Test Locally:**
   ```bash
   cd backend
   npm install
   npm start
   ```

---

### ❌ Error: "Service is sleeping" (Free Tier)

**Cause:**
Render free tier services sleep after 15 minutes of inactivity.

**Solution:**

1. **Upgrade to Paid Plan** (recommended for production)
2. **Use Render Cron Job** to ping your service every 10 minutes
3. **Accept the limitation** - first request after sleep takes ~30 seconds

---

## ✅ Quick Checklist

Before deploying, ensure:

- [ ] **Root Directory** is set correctly (`backend` for monorepo, empty for separate repo)
- [ ] **Build Command** is `npm install` (or `cd backend && npm install`)
- [ ] **Start Command** is `npm start` (or `cd backend && npm start`)
- [ ] **Node Version** is 18.x or 20.x
- [ ] **Environment Variables** are all set (see [BACKEND_ENV_VARIABLES.md](BACKEND_ENV_VARIABLES.md))
- [ ] **MongoDB Atlas** network access allows `0.0.0.0/0`
- [ ] **package.json** has `start` script: `"start": "node index.js"`

---

## 📞 Still Having Issues?

1. Check Render logs for specific error messages
2. Test backend locally first
3. Verify all environment variables are set
4. Check MongoDB Atlas connection
5. Review [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md) for complete setup

---

## 🔗 Useful Links

- [Render Documentation](https://render.com/docs)
- [Render Troubleshooting](https://render.com/docs/troubleshooting-deploys)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)
- [BACKEND_ENV_VARIABLES.md](BACKEND_ENV_VARIABLES.md)
- [MONGODB_CONNECTION_STRING.md](MONGODB_CONNECTION_STRING.md)
