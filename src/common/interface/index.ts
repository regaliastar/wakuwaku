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

export type PageEventType = keyof typeof pageOwnEventType | keyof typeof SecenEventType;

/** Parser */

export interface CharactarSay {
  name: string;
  img?: string;
  emotion?: string; // 表情喜怒哀乐
  text: string;
}

export interface ScriptScene {
  bg?: string;
  charactar?: Array<CharactarSay>;
  music?: string;
}

enum tokenType {
  'text',
  'bg',
  'music', // bgm
  'voice', // 音效
  'addCharactorName',
  'sayName',
  'sperator', // 分割符
  'aside', // 旁白
}

export interface Token {
  type: keyof typeof tokenType;
  value: string | CharactarSay;
}

// 定义场景事件类型
enum SecenEventType {
  'say', // 角色说话
  'aside', // 旁白
  'musicChange',
  'bgChange',
  'charactorChange',
  'voiceChange',
  'sperateEvent', // 分割事件，要求玩家交互（如点击屏幕）才能继续触发下个场景。该事件对外部透明
}

export interface SecenEvent {
  type: keyof typeof SecenEventType;
  value: CharactarSay | string | string[];
}

/** Container */
export type ReadyStateType = 'typingDone';
