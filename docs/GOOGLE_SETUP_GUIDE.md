# Google OAuth Setup Guide for GMS

## Current Status: ✅ Development Mode Active

You can now login with **Google (Test Mode)** without any setup!

---

## How to Use Google Sign-In Now

### Option 1: Google Test Mode (Ready Now - No Setup!)
1. Click "Continue with Google (Test Mode)" on login page
2. Creates a test user automatically
3. Perfect for development and testing

### Option 2: Real Google OAuth (Your Own Google Account)

To use your real Google account, follow these steps:

#### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Create Project"
3. Name it "GMS Gym Management" 
4. Click "Create"
5. Wait for project to be created

#### Step 2: Enable Google+ API
1. In Cloud Console, search for "Google+ API"
2. Click on "Google+ API"
3. Click "Enable"

#### Step 3: Create OAuth Credentials
1. Go to "Credentials" in left menu
2. Click "Create Credentials" → "OAuth Client ID"
3. If asked to create OAuth consent screen:
   - Select "External" user type
   - Fill in app name: "GMS"
   - Add your email
   - Save and continue
4. Back to OAuth client creation:
   - Select "Web application"
   - Name: "GMS Frontend"
   - Add these URIs under "Authorized JavaScript origins":
     - `http://localhost:3000`
     - `http://localhost:5173`
   - Add these under "Authorized redirect URIs":
     - `http://localhost:3000/login`
     - `http://localhost:3000`
   - Click "Create"

#### Step 4: Copy Your Client ID
1. In the popup or credentials list, find your new OAuth 2.0 Client ID
2. Click the copy icon next to "Client ID"
3. It looks like: `123456789012-abcdefghijklmnop.apps.googleusercontent.com`

#### Step 5: Add to Your App
1. Open `src/config/auth.js`
2. Change line 1: `const USE_MOCK_GOOGLE = false;` (set to false)
3. Paste your Client ID on line 5: 
   ```javascript
   export const GOOGLE_CLIENT_ID = "YOUR_ACTUAL_CLIENT_ID_HERE";
   ```
4. Save and refresh browser

---

## Files to Modify

### To Switch Between Test Mode and Real OAuth:

**File:** `src/config/auth.js`

```javascript
// Line 1 - Set to true for test mode, false for real OAuth
const USE_MOCK_GOOGLE = true;

// Line 5 - Add your Google Client ID here
export const GOOGLE_CLIENT_ID = ""; 
```

---

## Test Credentials

**Email Login:**
- Email: `admin@gym.com`
- Password: `admin123`

**Google Login:**
- Use "Continue with Google (Test Mode)" button
- Or use real Google account if configured

---

## Troubleshooting

### Error: "OAuth client was not found"
- Client ID is invalid or not set
- Set `USE_MOCK_GOOGLE = true` to use test mode
- Or add valid Client ID from Google Cloud Console

### Error: "Must be used within GoogleOAuthProvider"
- This is fixed - should not appear anymore
- If it does, check `USE_MOCK_GOOGLE` setting

### Test Mode Button Not Showing
- Make sure `USE_MOCK_GOOGLE = true` in `src/config/auth.js`
- Refresh browser (Ctrl+Shift+R for hard refresh)

---

## Summary

✅ **Ready Now:** Google Test Mode works immediately  
⏱️ **Optional:** Setup real Google OAuth when ready  
🔒 **Secure:** Test mode doesn't access your real Google account

Start testing with the test mode, then upgrade to real Google OAuth whenever you're ready!
