# Google OAuth Configuration

## Setup Instructions:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen
6. Create OAuth client ID for Web application
7. Add authorized JavaScript origins:
   - http://localhost:3000
   - http://localhost:5173 (Vite dev server)
8. Add authorized redirect URIs:
   - http://localhost:3000
   - http://localhost:5173
9. Copy the Client ID
10. Replace `YOUR_GOOGLE_CLIENT_ID_HERE` in `src/main.jsx` with your actual Client ID

## Current Configuration:
- File: `src/main.jsx`
- Line: `const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com";`

## Example Client ID format:
```
123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
```

## For Production:
- Use environment variables instead of hardcoding
- Create `.env` file with:
  ```
  VITE_GOOGLE_CLIENT_ID=your-client-id-here
  ```
- Update main.jsx to use: `import.meta.env.VITE_GOOGLE_CLIENT_ID`
