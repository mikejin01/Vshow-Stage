import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('🚀 Starting VSHOW NYC Venue Planner...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

console.log('✅ Root element found, mounting React app...');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('✅ React app mounted successfully');