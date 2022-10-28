import _ from 'lodash';
import { uid } from '~util/common';
import { SecenEvent, IfValue } from '~interface/parser';

type Instruction = SecenEvent;
type Event = Instruction[];
enum NodeType {
  'if',
  'label',
  'jump',
  'default',
  'root',
}

interface NextEventOptions {
  label: string;
}

export interface Node {
  value: Event;
  father?: Node;
  children: Node[];
  hash?: string;
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
    if (child.length === 1 && child[0].type === 'label' && !_.isString(child[0].value) && 'label' in child[0].value) {
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

  getChildByHash(hash: string) {
    if (!this.tail.children) return null;
    return this.tail.children.find(v => v.hash === hash);
  }

  getNextEvent(options?: NextEventOptions): Event | null {
    if (this.current.children.length === 0) return null;
    if (this.current.children.length === 1) {
      const res = this.current.children[0];
      this.current = this.current.children[0];
      return res.value;
    }
    if (options?.label) {
      const node = this.current.children.find(node => {
        if (
          node.value[0].type === 'label' &&
          !_.isString(node.value[0].value) &&
          'label' in node.value[0].value &&
          node.value[0].value.label === options?.label
        ) {
          return true;
        }
        return false;
      });
      if (node === undefined) {
        throw new Error(`找不到label: ${options.label}`);
      }
      const res = node.value;
      this.current = this.current.children[0];
      return res;
    }
    throw new Error(`找不到事件 ${options}, current: ${this.current}`);
  }
}

export default new EventTree();
