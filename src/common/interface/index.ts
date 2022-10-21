import { SecenEventType } from './parser';
/** Router */

export interface RoutePath {
  path: string;
  component: string;
}

/** Page */

export interface BasicViewInterface {
  _el: HTMLDivElement;
  template?: (params: ConstructorParams) => string;
  render: (params: ConstructorParams) => HTMLDivElement;
}

export type ConstructorParams = Record<string, string>;

// export type EventFnParams = string | string[] | CharactarSay | undefined;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventFnParams = any;

export type EventCallbackFn = (result: EventFnParams) => void;

export interface PageEventCompParams {
  componentName?: string;
  once?: boolean;
  params: EventFnParams;
}

// Page 自身独有的事件
enum pageOwnEventType {
  'onMount',
  'stopTyping',
}

export type PageEventType = keyof typeof pageOwnEventType | SecenEventType;
