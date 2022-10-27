import { v4 as uuidv4 } from 'uuid';
import { SecenEvent } from '~interface/parser';

type Instruction = SecenEvent;
type Event = Instruction[];

interface Node {
  value: Event;
  father?: Node;
  children?: Node[];
  label?: string;
  tag?: string;
}

class EventTree {
  root: Node = {
    value: [],
  };
  current: Node = {
    value: [],
  };

  bindRoot(_root: Event) {
    this.root.value = _root;
    this.root.tag = uuidv4();
    this.current.value = _root;
  }

  addChild(child: Event) {
    const item = {
      value: child,
      father: this.current,
      tag: uuidv4(),
    };
    this.current.children?.push(item);
  }

  getChildByLabel(label: string) {
    if (!this.current.children) return null;
    return this.current.children.find(v => v.label === label);
  }

  next(): Event[] | null {
    if (!this.current.children) return null;
    return this.current.children.map(v => v.value);
  }
}

export default EventTree;
