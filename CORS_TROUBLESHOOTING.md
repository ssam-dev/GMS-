# 🔧 CORS Troubleshooting Guide

## ❌ Common CORS Errors

### Error: "Access to fetch at '...' from origin '...' has been blocked by CORS policy"

This means your frontend URL is not allowed by the backend CORS configuration.

---

## ✅ Solution: Update CORS_ORIGIN in Render

### Step 1: Get Your Frontend Base URL

Your frontend URL is: `https://gms-6vat7ftxe-samarth-saindanes-projects.vercel.app/dashboard`

**Important**: Use the **base URL only** (without `/dashboard` or any path):

```
https://gms-6vat7ftxe-samarth-saindanes-projects.vercel.app
```

### Step 2: Update CORS_ORIGIN in Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your backend service (`gms-backend`)
3. Go to **Environment** tab
4. Find `CORS_ORIGIN` variable
5. Click **Edit**
6. Set the value to:
   ```
   https://gms-6vat7ftxe-samarth-saindanes-projects.vercel.app
   ```
7. **Important**: 
   - ✅ Include `https://`
   - ✅ No trailing slash
   - ✅ No path (no `/dashboard`)
8. Click **Save**
9. Render will automatically redeploy

### Step 3: Wait for Redeploy

- Wait 2-3 minutes for Render to redeploy
- Check Render logs to confirm deployment completed
- Test your frontend again

---

## 🔍 Verify CORS Configuration

### Check Current CORS_ORIGIN

1. Go to Render → Your Service → Environment
2. Verify `CORS_ORIGIN` matches your frontend base URL exactly

### Test CORS from Browser Console

Open your frontend in browser, open DevTools (F12), and run:

```javascript
fetch('https://gms-backend-wpxb.onrender.com/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

If you see CORS error, the CORS_ORIGIN is incorrect.

---

## 📋 Common Mistakes

### ❌ Wrong: Including Path
```
CORS_ORIGIN=https://gms-6vat7ftxe-samarth-saindanes-projects.vercel.app/dashboard
```
**Problem**: CORS checks the origin (protocol + domain + port), not the path.

### ❌ Wrong: Missing Protocol
```
CORS_ORIGIN=gms-6vat7ftxe-samarth-saindanes-projects.vercel.app
```
**Problem**: Must include `https://`

### ❌ Wrong: Trailing Slash
```
CORS_ORIGIN=https://gms-6vat7ftxe-samarth-saindanes-projects.vercel.app/
```
**Problem**: Trailing slash can cause issues.

### ✅ Correct Format
```
CORS_ORIGIN=https://gms-6vat7ftxe-samarth-saindanes-projects.vercel.app
```

---

## 🔄 Multiple Frontend URLs

If you have multiple frontend URLs (e.g., preview deployments), you can set multiple origins:

```
CORS_ORIGIN=https://gms-6vat7ftxe-samarth-saindanes-projects.vercel.app,https://gms.vercel.app,https://your-custom-domain.com
```

**Note**: Separate multiple URLs with commas (no spaces, or with spaces - the backend trims them).

---

## 🧪 Test CORS Configuration

### Method 1: Browser Console

1. Open your frontend: `https://gms-6vat7ftxe-samarth-saindanes-projects.vercel.app`
2. Open DevTools (F12) → Console
3. Run:
   ```javascript
   fetch('https://gms-backend-wpxb.onrender.com/api/health', {
     method: 'GET',
     headers: { 'Content-Type': 'application/json' }
   })
   .then(r => r.json())
   .then(data => console.log('✅ CORS Working:', data))
   .catch(err => console.error('❌ CORS Error:', err));
   ```

### Method 2: Check Network Tab

1. Open DevTools → Network tab
2. Try to make an API call from your frontend
3. Check the request:
   - **Status**: Should be 200 (not CORS error)
   - **Response Headers**: Should include `Access-Control-Allow-Origin: https://gms-6vat7ftxe-samarth-saindanes-projects.vercel.app`

---

## 🐛 Other Common Issues

### Issue: "Preflight request failed"

**Cause**: CORS preflight (OPTIONS request) is failing.

**Solution**: 
- Verify `credentials: true` is set in backend CORS config (already configured)
- Check that all required headers are allowed

### Issue: "Credentials flag is true, but Access-Control-Allow-Credentials is not"

**Cause**: Backend CORS needs `credentials: true` (already configured in your backend).

**Solution**: Already handled in `backend/index.js`:
```javascript
app.use(cors({
  origin: corsOrigins,
  credentials: true  // ✅ Already configured
}));
```

### Issue: CORS works in browser but not in production

**Possible Causes**:
1. Environment variable not set correctly
2. Backend not redeployed after CORS_ORIGIN change
3. Cached CORS response

**Solution**:
1. Verify CORS_ORIGIN in Render dashboard
2. Force redeploy backend
3. Clear browser cache
4. Try incognito/private window

---

## 📝 Quick Checklist

- [ ] CORS_ORIGIN set to base URL (no path, no trailing slash)
- [ ] Includes `https://` protocol
- [ ] Backend redeployed after CORS_ORIGIN change
- [ ] Waited 2-3 minutes for deployment
- [ ] Tested in browser console
- [ ] Checked Network tab for CORS headers

---

## 🔗 Related Documentation

- [BACKEND_ENV_VARIABLES.md](BACKEND_ENV_VARIABLES.md) - Environment variables guide
- [RENDER_TROUBLESHOOTING.md](RENDER_TROUBLESHOOTING.md) - Render deployment issues
- [NEXT_STEPS.md](NEXT_STEPS.md) - Deployment next steps

---

## 💡 Still Having Issues?

1. **Check Render Logs**: Look for CORS-related errors
2. **Verify Environment Variable**: Double-check CORS_ORIGIN in Render dashboard
3. **Test Backend Directly**: Visit `https://gms-backend-wpxb.onrender.com/api/health` - should work
4. **Check Browser Console**: Look for specific CORS error messages
5. **Try Temporary Wildcard**: For testing, set `CORS_ORIGIN=*` (not recommended for production)
