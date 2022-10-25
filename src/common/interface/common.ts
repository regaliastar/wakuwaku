import { LoadableComponent } from '@loadable/component';
import { ReactNode } from 'react';
import { CharactarSay } from './parser';

export type ComponentPage = {
  component: LoadableComponent<{ children?: ReactNode }>;
  path: string;
  children?: Record<string, ComponentPage>;
};

export type SaveData = {
  id: string;
  step: number;
  date: string;
  meta?: string;
  currentCharactarSay?: CharactarSay;
  currentChangeCharactors?: string[];
  currentBg?: string;
};
