// Authentication configuration

// OPTION 1: Development Mode (Mock Google OAuth - no setup needed)
const USE_MOCK_GOOGLE = true;

// OPTION 2: Production Mode (Your Google Client ID from Google Cloud Console)
// Set USE_MOCK_GOOGLE = false and add your actual Client ID here
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ""; // Your Google Client ID will go here

// Check if Google Auth is enabled and configured
export const isGoogleAuthEnabled = () => {
  return USE_MOCK_GOOGLE || (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID.length > 20);
};

// Export mode for Login page
export const GOOGLE_AUTH_MODE = USE_MOCK_GOOGLE ? 'mock' : 'oauth';
