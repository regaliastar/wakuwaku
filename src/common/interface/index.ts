/* eslint-disable @typescript-eslint/ban-types */
export interface RoutePath {
  path: string;
  component: string;
}

export interface BasicViewInterface {
  _el: HTMLDivElement;
  render: Function;
}

export type EventFnParams = string | string[] | CharactarSay;

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
  'music',
  'addCharactorName',
  'sayName',
  'sperator',
}

export interface Token {
  type: keyof typeof tokenType;
  value: string | CharactarSay;
}

// 定义场景事件类型
enum SecenEventType {
  'say',
  'musicChange',
  'bgChange',
  'addCharactor',
}

export interface SecenEvent {
  type: keyof typeof SecenEventType;
  value: CharactarSay | string | string[];
}
