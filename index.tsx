
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Tailwind base styles are applied via CDN link in index.html
// Global styles or react-big-calendar CSS also via index.html

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
    