import _ from 'lodash';
import { uid } from '~util/common';
import { Instruction, IfValue, CharactarSay } from '~interface/parser';

type Event = Instruction[];
enum NodeType {
  'if',
  'label',
  'jump',
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
  NodeType?: keyof typeof NodeType;
}

class EventTree {
  root: Node = {
    value: [],
    children: [],
    NodeType: 'root',
    hash: uid(),
  };
  tail: Node = this.root;
  current: Node = this.root;

  init() {
    this.current = this.root;
  }

  show() {
    console.log('============= show ===============');
    let pointer: Node = _.cloneDeep(this.root);
    while (pointer) {
      if (pointer.children) {
        pointer.children.forEach(n => console.dir(n));
      }
      pointer = pointer.children[0];
    }
    console.log('============= show end ===============');
  }

  loadEvents(events: Event[]): EventTree {
    events.forEach(event => {
      this.addChild(event);
    });
    return this;
  }

  addChild(child: Event): Node {
    const item: Node = {
      value: child,
      father: this.tail,
      hash: uid(),
      NodeType: 'default',
      children: [],
    };
    if (child.length === 1 && child[0].type === 'label') {
      item.NodeType = 'label';
    }
    if (child.length === 1 && child[0].type === 'if') {
      item.NodeType = 'if';
    }
    if (child.length === 1 && child[0].type === 'jump') {
      item.NodeType = 'jump';
    }
    // 如果当前节点是label，接入该label的父节点if
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
            item.father = pointer;
            pointer.children.push(item);
            this.tail = item;
            return this.tail;
          }
        }
        pointer = pointer.father;
      }
      throw new Error(`找不到if语句 ${JSON.stringify(child)}`);
    }
    // 如果上一个节点是label且该节点为普通节点，默认if的子节点全是label
    if (this.tail.NodeType === 'label') {
      this.tail.father?.children.forEach(labelNode => labelNode.children.push(item));
    } else {
      this.tail.children?.push(item);
    }
    this.tail = item;
    return this.tail;
  }

  getCurrentHash(): string {
    return this.current.hash;
  }

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
        throw new Error(`找不到label: ${params.label}`);
      }
      this.current = this.current.children[0];
      return node;
    }
    throw new Error(`找不到事件 ${JSON.stringify(params)}, current: ${JSON.stringify(this.current)}`);
  }
}

export default new EventTree();
