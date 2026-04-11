import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
<<<<<<< HEAD
<<<<<<< HEAD
import { getApiBaseUrl } from './config/apiConfig.js'
=======
import { detectBackendPort } from './utils/apiConfig.js'
>>>>>>> 041b17aa (modification)
=======
import { getApiBaseUrl } from './config/apiConfig.js'
>>>>>>> 5469f3f1 (chore: update gitignore and remove sensitive files)

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

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 5469f3f1 (chore: update gitignore and remove sensitive files)
// D-9 fix: Render immediately instead of waiting for backend port detection
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Pre-warm backend port detection in the background (non-blocking)
getApiBaseUrl().catch((error) => {
  console.warn('Backend port detection failed:', error);
<<<<<<< HEAD
=======
// Initialize backend port detection
detectBackendPort().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}).catch((error) => {
  console.error('Failed to initialize app:', error);
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
>>>>>>> 041b17aa (modification)
=======
>>>>>>> 5469f3f1 (chore: update gitignore and remove sensitive files)
});