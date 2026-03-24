import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    window.dispatchEvent(
      new CustomEvent(serviceWorkerRegistration.PWA_UPDATE_EVENT, {
        detail: { registration },
      })
    );
  },
});

