import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import './index.css'
import { GOOGLE_CLIENT_ID, isGoogleAuthEnabled } from './config/auth.js'

const AppWrapper = () => {
  // Only wrap with GoogleOAuthProvider if Client ID is configured
  if (isGoogleAuthEnabled()) {
    return (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    );
  }
  // No Google OAuth - regular app
  return <App />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>,
)
