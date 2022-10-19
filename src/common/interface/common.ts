import { LoadableComponent } from '@loadable/component';
import { ReactNode } from 'react';

export type ComponentPage = {
  component: LoadableComponent<{ children?: ReactNode }>;
  path: string;
  children?: Record<string, ComponentPage>;
};
