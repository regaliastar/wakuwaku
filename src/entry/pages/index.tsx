import loadable from '@loadable/component';
import { ComponentPage } from '~interface/common';

export function getPageGroups(): ComponentPage[] {
  const Welcome = loadable(() => import('~page/Welcome'));
  const Content = loadable(() => import('~page/Content'));
  const Save = loadable(() => import('~page/Save'));
  const Settings = loadable(() => import('~page/Settings'));

  return [
    {
      component: Welcome,
      path: '/welcome',
    },
    {
      component: Content,
      path: '/content',
    },
    {
      component: Save,
      path: '/save',
    },
    {
      component: Settings,
      path: '/settings',
    },
  ];
}
