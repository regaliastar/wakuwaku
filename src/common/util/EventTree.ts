import _ from 'lodash';
import { loadScript, uid, groupEvent, generateNodeByinstructions, assignNodeType, resetUid } from '~util/common';
import { Instruction, IfValue, CharactarSay } from '~interface/parser';

type Event = Instruction[];
enum NodeTypeEnum {
  'if',
  'label',
  'jump',
  'exit',
  'default',
  'root',
}

export interface NextEventParams {
  label: string;
}

export interface Node {
  value: Event;
  father?: Node;
  children: Node[];
  hash: string;
  NodeType?: keyof typeof NodeTypeEnum;
}

export class EventTree {
  root: Node = {
    value: [],
    children: [],
    NodeType: 'root',
    hash: uid(),
  };
  tail: Node = this.root;
  current: Node = this.root;
  lastLayer: Array<Node> = [this.root]; // 记录最底层的叶节点

  init() {
    this.current = this.root;
    this.lastLayer = [this.root];
  }

  show() {
    console.log('============= show ===============');
    const pointer: Node = _.cloneDeep(this.root);
    function core(node: Node) {
      console.dir(node);
      if (node.children) {
        node.children.forEach(n => {
          core(n);
        });
      }
    }
    core(pointer);
    console.log('============= show end ===============');
  }

  loadEvents(events: Event[]): EventTree {
    resetUid();
    this.root = {
      value: [],
      children: [],
      NodeType: 'root',
      hash: uid(),
    };
    this.init();
    events.forEach(event => {
      this.addChild(event);
    });
    return this;
  }

  jump(filename: string) {
    const events = loadScript(filename);
    this.loadEvents(events);
  }

  addChild(child: Event): Node {
    let item: Node = {
      value: child,
      father: this.tail,
      hash: uid(),
      NodeType: 'default',
      children: [],
    };
    item = assignNodeType(item);
    // 如果当前节点是label，接入该label上最近的父节点if
    if (
      child.length === 1 &&
      child[0].type === 'label' &&
      !_.isString(child[0].value) &&
      'label' in child[0].value &&
      'instructions' in child[0].value
    ) {
      const label = child[0].value.label;
      let pointer = this.tail;
      while (pointer.father) {
        if (
          pointer.NodeType === 'if' &&
          _.isArray(pointer.value[0].value) &&
          !_.isString(pointer.value[0].value) &&
          pointer.value[0].value instanceof Array<IfValue>
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const labelCol = pointer.value[0].value.map((v: any) => v.label);
          if (labelCol.includes(label)) {
            // 支持 label 包裹多个事件
            const instructions = child[0].value.instructions;
            const events = groupEvent(instructions);
            // 如果 label 只包裹一个事件
            if (events.length === 1) {
              item.father = pointer;
              pointer.children.push(item);
              this.tail = item;
              this.lastLayer.push(this.tail);
              return this.tail;
            }
            const [headNode, tailNode] = generateNodeByinstructions(child[0].value);
            headNode.father = pointer;
            pointer.children.push(headNode);
            this.tail = tailNode;
            this.lastLayer.push(this.tail);
            return this.tail;
          }
        }
        pointer = pointer.father;
      }
      throw new Error(`找不到if语句 ${JSON.stringify(child)}`);
    }
    // 如果插入的节点不是label节点
    this.lastLayer = this.lastLayer.filter(node => node.NodeType !== 'if');
    this.lastLayer.forEach(node => {
      node.children.push(item);
    });
    this.tail = item;
    this.lastLayer = [this.tail];
    return this.tail;
  }

  getCurrentHash(): string {
    return this.current.hash;
  }

  // todo: 只push玩家刚刚看到的历史
  getHistory(): CharactarSay[] {
    const hash = this.current.hash;
    if (hash === this.root.hash) return [];
    let pointer: Node = _.cloneDeep(this.root);
    const res: CharactarSay[] = [];
    while (pointer && pointer.hash !== hash) {
      if (pointer.children) {
        pointer.children.forEach(n => {
          if (n.hash === hash) {
            return res;
          }
          const event = n.value.filter(inst => inst.type === 'aside' || inst.type === 'say' || inst.type === 'if');
          event.forEach(inst => {
            if (inst.type === 'if' && _.isArray(inst.value)) {
              inst.value.forEach(item => {
                if (_.isString(item)) return;
                res.push({
                  name: '',
                  text: '> ' + item.text,
                });
              });
              res.push({
                name: '',
                text: '...',
              });
            }
            if (inst.type === 'aside') {
              res.push({
                name: '',
                text: inst.value as string,
              });
            }
            if (inst.type === 'say' && !_.isString(inst.value) && 'name' in inst.value && 'text' in inst.value) {
              res.push(inst.value);
            }
          });
        });
      }
      pointer = pointer.children[0];
    }
    return res;
  }

  gotoByHash(hash: string): Node {
    this.current = this.root;
    let res: Node = this.current;
    while (this.current) {
      if (this.current.children) {
        this.current.children.forEach(n => {
          if (n.hash === hash) {
            res = n;
            return this.current;
          }
        });
      }
      this.current = this.current.children[0];
    }
    this.current = res;
    return res;
  }

  getNextNode(params?: NextEventParams): Node | null {
    if (this.current.children.length === 0) return null;
    if (this.current.children.length === 1) {
      const res = this.current.children[0];
      this.current = this.current.children[0];
      return res;
    }
    if (params?.label) {
      const node = this.current.children.find(node => {
        if (
          node.value[0].type === 'label' &&
          !_.isString(node.value[0].value) &&
          'label' in node.value[0].value &&
          node.value[0].value.label === params?.label
        ) {
          return true;
        }
        return false;
      });
      if (node === undefined) {
        console.log(this.current);
        throw new Error(`找不到label: ${params.label}`);
      }
      this.current = node;
      return node;
    }
    console.log(this.current);
    throw new Error(`找不到事件 ${JSON.stringify(params)}`);
  }
}

export default new EventTree();
