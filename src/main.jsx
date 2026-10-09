import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Development must always load the current source, rather than an old PWA bundle.
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.filter(registration => registration.scope.startsWith(location.origin + '/'))
      .forEach(registration => registration.unregister());
  });
  caches.keys().then(keys => keys.filter(key => key.startsWith('iitm-study-')).forEach(key => caches.delete(key)));
}
