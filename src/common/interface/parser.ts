/** Token */
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
export type LabelValue = {
  label: string;
  instructions: Instruction[];
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
type TokenValue = string | CharactarSay | IfValue;
export interface CommonToken {
  type: keyof typeof tokenType;
  value: TokenValue;
}
export type Token = CommonToken | IfToken;

/** Parser */
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

interface LabelSecenEvent {
  type: 'label';
  value: Instruction[];
}

export type SecenEventType = keyof typeof SecenEventTypeEnum;
export type SecenEventValue = TokenValue | string[] | LabelValue | IfValue[];

export interface CommonSecenEvent {
  type: SecenEventType;
  value: SecenEventValue;
}

export type Instruction = CommonSecenEvent | LabelSecenEvent;
