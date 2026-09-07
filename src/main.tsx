import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/Common/ErrorBoundary.tsx';
import { registerSW } from 'virtual:pwa-register';
import './index.css';

// Register PWA Service Worker for offline capability & fast precaching
if ('serviceWorker' in navigator && typeof window !== 'undefined') {
  registerSW({
    immediate: true,
    onNeedRefresh() {
      console.log('[GeetaFlow PWA] New content available.');
    },
    onOfflineReady() {
      console.log('[GeetaFlow PWA] App ready to work offline.');
    },
  });
}

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

