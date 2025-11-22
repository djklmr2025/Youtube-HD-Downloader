import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

// We wrap the app in a context, but the Client ID might be dynamic based on user input
// For this demo, we handle the Provider inside App or wrapping specific components if the ID is known.
// However, react-oauth/google requires the provider at the top. 
// We will create a wrapper component in App.tsx to handle the dynamic Client ID.

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