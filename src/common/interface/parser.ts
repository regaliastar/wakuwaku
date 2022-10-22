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
  'bgm',
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
export enum SecenEventTypeEnum {
  'say', // 角色说话, CharactarSay
  'aside', // 旁白
  'bgmChange',
  'bgChange',
  'charactorChange',
  'voiceChange',
  'sperateEvent', // 分割事件，要求玩家交互（如点击屏幕）才能继续触发下个场景。该事件对外部透明
}

export type SecenEventType = keyof typeof SecenEventTypeEnum;
export type SecenEventValue = CharactarSay | string | string[];

export interface SecenEvent {
  type: SecenEventType;
  value: SecenEventValue;
}
