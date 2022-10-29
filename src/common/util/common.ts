import * as fs from 'fs';
import { Scanner, Parser } from '~util/parser';
import { Instruction } from '~interface/parser';

export const loadScript = (filepath: string) => {
  if (!fs.existsSync(filepath)) {
    throw new Error(`${filepath} 文件不存在`);
  }
  const text = fs.readFileSync(filepath, { encoding: 'utf8', flag: 'r' });
  const tokens = Scanner(text);
  const events = Parser(tokens);
  return events;
};

let id = -1;
export const uid = (): string => {
  id += 1;
  return id.toString();
};

/** 在同一个事件中，只能存在一个不可组合指令。默认 say、aside 类型事件需要交互（点击）*/
export const groupEvent = (instructions: Instruction[]): Instruction[][] => {
  const cannotCombindInstruction = ['say', 'sperateEvent', 'aside', 'if', 'label'];
  // 组合可并行指令生成事件
  let events: Instruction[][] = [];
  instructions.forEach(inst => {
    if (events.length > 0 && events[events.length - 1].every(e => !cannotCombindInstruction.includes(e.type))) {
      events[events.length - 1].push(inst);
      return;
    }
    events.push([inst]);
  });
  events = events.map(event => {
    return event.filter(e => e.type !== 'sperateEvent');
  });
  return events;
};
