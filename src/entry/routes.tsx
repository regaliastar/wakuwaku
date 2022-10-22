import React, { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { getPageGroups } from './pages/index';
import { ComponentPage } from '~interface/common';

const AppRoutes: FC = () => {
  const routes: ComponentPage[] = getPageGroups();
  return (
    <Routes>
      {routes.map(rt => (
        <Route key={rt.path} path={rt.path} element={<rt.component />}></Route>
      ))}
      <Route path="*" element={<Navigate to={routes[0].path} replace />} />
    </Routes>
  );
};

export default AppRoutes;
