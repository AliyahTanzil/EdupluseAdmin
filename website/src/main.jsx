import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { getApiBaseUrl } from './config/apiConfig.js'

// Suppress extension communication errors
window.addEventListener('error', (event) => {
  if (event.message?.includes?.('Could not establish connection') || 
      event.message?.includes?.('Receiving end does not exist')) {
    event.preventDefault();
    return false;
  }
});

// Also suppress unhandled promise rejections for extension errors
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.message?.includes?.('Could not establish connection') || 
      event.reason?.message?.includes?.('Receiving end does not exist')) {
    event.preventDefault();
    return false;
  }
});

// D-9 fix: Render immediately instead of waiting for backend port detection
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Pre-warm backend port detection in the background (non-blocking)
getApiBaseUrl().catch((error) => {
  console.warn('Backend port detection failed:', error);
});
