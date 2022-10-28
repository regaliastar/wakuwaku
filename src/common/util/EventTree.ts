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

interface Node {
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
  current: Node = this.root;

  show() {
    console.log('============= show ===============');
    let pointer: Node = _.cloneDeep(this.root);
    while (pointer) {
      console.dir(pointer, { depth: null });
      if (pointer.children) {
        pointer.children.forEach(n => console.dir(n, { depth: null }));
      }
      pointer = pointer.children[0];
    }
  }

  loadEvents(events: Event[]) {
    events.forEach(event => {
      this.addChild(event);
    });
  }

  addChild(child: Event): Node {
    const item: Node = {
      value: child,
      father: this.current,
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
      let pointer = _.cloneDeep(this.current);
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
            this.current = item;
            console.log('label father');
            console.dir(item.father, { depth: null });
            return this.current;
          }
        }
        pointer = pointer.father;
      }
      throw new Error(`找不到if语句 ${JSON.stringify(child)}`);
    }
    // 如果上一个节点是label且该节点为普通节点，默认if的子节点全是label
    if (this.current.NodeType === 'label') {
      this.current.father?.children.forEach(labelNode => labelNode.children.push(item));
    } else {
      this.current.children?.push(item);
    }
    this.current = item;
    // console.dir(item);
    return this.current;
  }

  getChildByHash(hash: string) {
    if (!this.current.children) return null;
    return this.current.children.find(v => v.hash === hash);
  }

  getNextEvent(): Event[] | null {
    if (!this.current.children) return null;
    return this.current.children.map(v => v.value);
  }
}

export default new EventTree();
