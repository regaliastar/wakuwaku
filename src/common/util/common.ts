import * as fs from 'fs';
import { Node } from './EventTree';
import { Scanner, Parser } from '~util/parser';
import { Instruction, LabelValue } from '~interface/parser';

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

export const resetUid = () => {
  id = -1;
};

/** 在同一个事件中，只能存在一个不可组合指令。默认 say、aside 类型事件需要交互（点击）*/
export const groupEvent = (instructions: Instruction[]): Instruction[][] => {
  const cannotCombindInstruction = ['say', 'sperateEvent', 'aside', 'if', 'label', 'jump', 'exit'];
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

/** 根据 instructions 生成首尾互联的 Node 节点 */
export const generateNodeByinstructions = (value: LabelValue): Node[] => {
  const instructions = value.instructions;
  const events = groupEvent(instructions);
  if (events.length < 2) {
    throw new Error('生成首尾 Node 节点只允许事件数大于2');
  }
  const headNode: Node = {
    value: [
      {
        type: 'label',
        value: {
          instructions: events[0],
          label: value.label,
        },
      },
    ],
    hash: uid(),
    NodeType: 'label',
    children: [],
  };
  let tailNode: Node = headNode;
  events.forEach((e, index) => {
    if (index === 0) return;
    let temp: Node = {
      value: e,
      father: tailNode,
      hash: uid(),
      NodeType: 'default',
      children: [],
    };
    temp = assignNodeType(temp);
    tailNode.children.push(temp);
    tailNode = temp;
  });
  return [headNode, tailNode];
};

export const assignNodeType = (node: Node): Node => {
  const child = node.value;
  if (child.length === 1 && child[0].type === 'label') {
    node.NodeType = 'label';
  }
  if (child.length === 1 && child[0].type === 'if') {
    node.NodeType = 'if';
  }
  if (child.length === 1 && child[0].type === 'jump') {
    node.NodeType = 'jump';
  }
  if (child.length === 1 && child[0].type === 'exit') {
    node.NodeType = 'exit';
  }
  return node;
};
