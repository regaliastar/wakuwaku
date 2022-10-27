export interface CharactarSay {
  name: string;
  img?: string;
  emotion?: string; // 表情喜怒哀乐
  text: string;
}

export interface IfValue {
  text: string;
  label: string;
}
type IfToken = {
  type: 'if';
  value: IfValue;
};
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
  'label',
  'jump',
}

export interface CommonToken {
  type: keyof typeof tokenType;
  value: string | CharactarSay | IfValue;
}
export type Token = CommonToken | IfToken;

// 定义场景事件类型
export enum SecenEventTypeEnum {
  'say', // 角色说话, CharactarSay
  'aside', // string
  'bgmChange',
  'bgChange',
  'charactorChange',
  'voiceChange',
  'sperateEvent', // 分割事件，要求玩家交互（如点击屏幕）才能继续触发下个场景。该事件对外部透明
  'if', // 选项
  'label', // 选项结果
  'jump', // 剧本跳转
}
type LabelValue = {
  label: string;
  instructions: SecenEvent[];
};

export type SecenEventType = keyof typeof SecenEventTypeEnum;
export type SecenEventValue = CharactarSay | string | string[] | LabelValue | IfValue | IfValue[];

export interface SecenEvent {
  type: SecenEventType;
  value: SecenEventValue | SecenEvent[];
}
