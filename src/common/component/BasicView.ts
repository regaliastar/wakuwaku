/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BasicViewInterface, EventFnParams } from '~interface/index';
import { createElement } from '~util/index';

enum EventTypeEnum {
  'onMount', // 页面加载完毕
  'bgChange',
  'say',
  'musicChange',
  'addCharactor',
  'stopTyping',
}
type EventType = keyof typeof EventTypeEnum;

export interface PageEventCompParams {
  componentName?: string;
  once?: boolean;
  params: EventFnParams;
}

export default class BasicView implements BasicViewInterface {
  _appEvents: Record<EventType, any> = {
    onMount: undefined,
    bgChange: undefined,
    say: undefined,
    musicChange: undefined,
    addCharactor: undefined,
    stopTyping: undefined,
  };
  _el: HTMLDivElement;
  _componentName = '';
  _children: Record<string, BasicView> = {};
  _father: BasicView | undefined;
  _data: Record<string, string | unknown> = {}; // 组件数据通信

  constructor(_args?: any) {
    this._el = this.render(_args);
  }

  // eslint-disable-next-line
  template(_args?: any): string {
    return '';
  }

  setData(name: string, value: Record<string, unknown> | string | unknown) {
    this._data[name] = value;
  }

  render(_args?: any): HTMLDivElement {
    const node = createElement(this.template(_args));
    return node;
  }

  registerEvent(type: EventType, fn: (params: EventFnParams) => void) {
    if (this._appEvents[type]) {
      throw new Error(`存在已注册事件 ${type}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    const currying = (fn: Function) => {
      return (params: EventFnParams) => {
        fn.call(_this, params);
      };
    };
    this._appEvents[type] = currying(fn);
  }

  // 与父组件通信，控制反转，子组件抛出方法让父组件执行，而不需要关注父组件具体方法实现。
  triggerFatherEvent(eventType: EventType, params?: PageEventCompParams) {
    if (this._father) {
      if (this._father._componentName === params?.componentName && this._father._appEvents[eventType]) {
        this._father._appEvents[eventType](params?.params);
        return;
      }
      this._father.triggerFatherEvent(eventType, params);
    }
  }

  // 触发子组件和自身事件
  triggerChildrenEvent(eventType: EventType, params?: PageEventCompParams) {
    if (params?.componentName) {
      if (this._componentName === params?.componentName && this._appEvents[eventType]) {
        this._appEvents[eventType](params?.params);
        return;
      }
    } else {
      // 没有传递 componentName，全触发
      if (this._appEvents[eventType]) {
        this._appEvents[eventType](params?.params);
        if (params?.once) {
          return;
        }
      }
    }
    if (this._children) {
      Object.keys(this._children).forEach((key: string) => {
        this._children[key].triggerChildrenEvent(eventType, params);
      });
    }
  }

  registerChildComponent(name: string, component: BasicView) {
    // eslint-disable-next-line no-prototype-builtins
    if (this._children.hasOwnProperty(name)) {
      const comp = this._children[name];
      // todo
      comp.remove();
    }
    this._children[name] = component;
    component._father = this;
    component._componentName = name;
    return component;
  }

  getChildComponent(name: string) {
    // eslint-disable-next-line no-prototype-builtins
    if (this._children.hasOwnProperty(name)) {
      const comp = this._children[name];
      return comp;
    } else {
      throw new Error(`${name}组件不存在`);
    }
  }

  // 更新自身节点
  updateComponent(component: HTMLElement) {
    if (this._father) {
      this._father._el.insertBefore(component, this._el);
      this.remove();
      return;
    }
    throw new Error('不能更新不存在父节点的节点');
  }

  remove() {
    if (this._father) {
      this._father._el.removeChild(this._el);
    }
  }
}
