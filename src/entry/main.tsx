import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import App from './App';
import { loadScript } from '~util/common';
import EventTree from '~util/EventTree';

EventTree.loadEvents(loadScript('drama/test.txt'));
EventTree.show();
location.hash = '';
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </StrictMode>,
  );
}
