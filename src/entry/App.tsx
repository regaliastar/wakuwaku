import React, { FC } from 'react';
import { HashRouter } from 'react-router-dom';
import AppRoutes from './routes';

const App: FC = () => {
  return (
    <HashRouter>
      <AppRoutes></AppRoutes>
    </HashRouter>
  );
};

export default App;
