import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

location.hash = '';
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
