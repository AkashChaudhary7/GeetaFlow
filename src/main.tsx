import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/Common/ErrorBoundary.tsx';
import './index.css';

// Safe global error capturing to suppress unformatted cross-origin script error noise
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    // Prevent unhandled script errors from showing blank screens or breaking applet preview
    console.warn('[GeetaFlow Handled Global Error]:', event.message || event);
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.warn('[GeetaFlow Handled Unhandled Promise Rejection]:', event.reason || event);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

