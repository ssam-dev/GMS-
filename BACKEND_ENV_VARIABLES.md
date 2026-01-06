# 🔧 Backend Environment Variables Guide

Complete reference for backend deployment environment variables.

## 📋 Required Environment Variables

### 1. `NODE_ENV`
**Description**: Environment mode (development or production)  
**Required**: ✅ Yes  
**Example Values**:
```env
NODE_ENV=production
```
**Usage**: Controls error message detail level, logging, and some security settings.

---

### 2. `PORT`
**Description**: Port number for the backend server  
**Required**: ✅ Yes  
**Default**: `5000`  
**Example Values**:
```env
PORT=5000
```
**Usage**: The port your backend API will run on.

---

### 3. `MONGODB_URI`
**Description**: MongoDB connection string  
**Required**: ✅ Yes  
**Example Values**:
```env
# Your actual connection string
MONGODB_URI=mongodb+srv://s6384222_db_user:Samarth21%23@cluster0.tn0bgql.mongodb.net/ans?retryWrites=true&w=majority

# Or for local development
MONGODB_URI=mongodb://localhost:27017/gms
```
**Format**: `mongodb+srv://username:password@cluster.mongodb.net/database?options`

**Important Notes**:
- URL-encode special characters in password (e.g., `#` becomes `%23`)
- Include database name in the connection string
- Add query parameters for better reliability: `?retryWrites=true&w=majority`

---

### 4. `CORS_ORIGIN`
**Description**: Allowed frontend origins (comma-separated)  
**Required**: ✅ Yes  
**Example Values**:
```env
# Single origin
CORS_ORIGIN=https://gms-frontend.vercel.app

# Multiple origins (comma-separated)
CORS_ORIGIN=https://gms-frontend.vercel.app,https://www.yourdomain.com

# Development
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```
**Usage**: Controls which frontend URLs can access your API. Must include your frontend deployment URL.

---

## 🔹 Optional Environment Variables

### 5. `API_URL`
**Description**: Public API URL (used for Swagger documentation)  
**Required**: ❌ No  
**Default**: Uses current request URL  
**Example Values**:
```env
API_URL=https://gms-backend.onrender.com
```
**Usage**: Used in Swagger/OpenAPI documentation to show the correct API base URL.

---

## 📝 Complete Example

### For Development (`backend/.env`):
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://s6384222_db_user:Samarth21%23@cluster0.tn0bgql.mongodb.net/ans?retryWrites=true&w=majority
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
API_URL=http://localhost:5000
```

### For Production (Render/Railway/Heroku):
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://s6384222_db_user:Samarth21%23@cluster0.tn0bgql.mongodb.net/ans?retryWrites=true&w=majority
CORS_ORIGIN=https://gms-frontend.vercel.app
API_URL=https://gms-backend.onrender.com
```

---

## 🚀 Setting Environment Variables by Platform

### Render
1. Go to your service dashboard
2. Click **Environment** tab
3. Click **Add Environment Variable**
4. Add each variable:
   - Key: `NODE_ENV`
   - Value: `production`
   - Repeat for all variables
5. Click **Save Changes**

### Railway
1. Go to your project dashboard
2. Click on your service
3. Go to **Variables** tab
4. Click **New Variable**
5. Add each variable and save

### Heroku
```bash
# Using Heroku CLI
heroku config:set NODE_ENV=production
heroku config:set PORT=5000
heroku config:set MONGODB_URI="mongodb+srv://..."
heroku config:set CORS_ORIGIN="https://your-frontend.vercel.app"
```

Or via Heroku Dashboard:
1. Go to your app
2. Click **Settings**
3. Click **Reveal Config Vars**
4. Add each variable

---

## ⚠️ Important Notes

### Security
- **Never commit `.env` files to Git**
- Use environment variables in deployment platforms
- Keep your MongoDB password secure
- Don't share connection strings publicly

### MongoDB Connection String
- Your password contains `#` which must be URL-encoded as `%23`
- Always include the database name in the connection string
- Add query parameters for production: `?retryWrites=true&w=majority`

### CORS Configuration
- Must include your frontend URL
- Can include multiple origins (comma-separated)
- No trailing slashes
- Include protocol (`https://` or `http://`)

### Port Configuration
- Render/Railway may auto-assign PORT
- Some platforms require using `process.env.PORT`
- Backend code already handles this: `const PORT = process.env.PORT || 5000`

---

## 🔍 Verification

After setting environment variables, verify they're working:

1. **Check Backend Logs**:
   ```
   ✅ MongoDB connected successfully
   Backend running on port 5000
   ```

2. **Test Health Endpoint**:
   ```bash
   curl https://your-backend-url.onrender.com/api/health
   ```

3. **Check Swagger Docs**:
   Visit: `https://your-backend-url.onrender.com/api/docs`

---

## 📊 Environment Variables Summary Table

| Variable | Required | Default | Example |
|----------|----------|---------|---------|
| `NODE_ENV` | ✅ Yes | - | `production` |
| `PORT` | ✅ Yes | `5000` | `5000` |
| `MONGODB_URI` | ✅ Yes | - | `mongodb+srv://...` |
| `CORS_ORIGIN` | ✅ Yes | - | `https://frontend.vercel.app` |
| `API_URL` | ❌ No | Auto-detect | `https://backend.onrender.com` |

---

## 🆘 Troubleshooting

### MongoDB Connection Fails
- Check connection string format
- Verify password is URL-encoded
- Ensure database name is correct
- Check MongoDB Atlas network access (allow all IPs: `0.0.0.0/0`)

### CORS Errors
- Verify `CORS_ORIGIN` includes your frontend URL
- Check for typos in the URL
- Ensure no trailing slashes
- Include protocol (`https://`)

### Port Issues
- Some platforms auto-assign PORT
- Backend code handles this automatically
- Check platform logs for actual port used

---

**Last Updated**: January 6, 2026
