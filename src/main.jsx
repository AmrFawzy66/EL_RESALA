import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { ShiftProvider } from './contexts/ShiftContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import './index.css';

// BrowserRouter (not HashRouter) — this is a real web deployment served
// by Vercel over HTTP, so clean URLs work. Vercel needs a rewrite rule
// so a hard refresh on e.g. /reports still serves index.html instead of
// 404ing — see vercel.json in the project root.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <ShiftProvider>
          <App />
        </ShiftProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
