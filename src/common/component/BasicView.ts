import {
  BasicViewInterface,
  ConstructorParams,
  EventFnParams,
  PageEventType,
  EventCallbackFn,
  PageEventCompParams,
} from '~interface/index';
import { createElement } from '~util/index';

export default class BasicView implements BasicViewInterface {
  _appEvents: Record<PageEventType, EventCallbackFn | undefined> = {
    onMount: undefined,
    bgChange: undefined,
    say: undefined,
    musicChange: undefined,
    charactorChange: undefined,
    stopTyping: undefined,
    aside: undefined,
    voiceChange: undefined,
    sperateEvent: undefined,
  };
  _el: HTMLDivElement;
  _componentName = '';
  _children: Record<string, BasicView> = {};
  _father: BasicView | undefined;

  constructor(_args?: ConstructorParams) {
    this._el = this.render(_args);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  template(_args?: ConstructorParams): string {
    return '';
  }

  render(_args?: ConstructorParams): HTMLDivElement {
    if (this.template) {
      const node = createElement(this.template(_args));
      return node;
    }
    return createElement('<>');
  }

  registerEvent(type: PageEventType, fn: EventCallbackFn) {
    if (this._appEvents[type]) {
      throw new Error(`存在已注册事件 ${type}`);
    }
    const currying = (fn: EventCallbackFn, _this: BasicView) => {
      return (params: EventFnParams) => {
        fn.call(_this, params);
      };
    };
    this._appEvents[type] = currying(fn, this);
  }

  // 与父组件通信，控制反转，子组件抛出方法让父组件执行，而不需要关注父组件具体方法实现。
  triggerFatherEvent(eventType: PageEventType, params?: PageEventCompParams) {
    if (this._father) {
      if (this._father._componentName === params?.componentName && this._father._appEvents[eventType]) {
        this._father._appEvents[eventType]?.(params?.params);
        return;
      }
      this._father.triggerFatherEvent(eventType, params);
    }
  }

  // 触发子组件和自身事件
  triggerChildrenEvent(eventType: PageEventType, params?: PageEventCompParams) {
    if (params?.componentName) {
      if (this._componentName === params.componentName && this._appEvents[eventType]) {
        this._appEvents[eventType]?.(params?.params);
        return;
      }
    } else {
      // 没有传递 componentName，全触发
      if (this._appEvents[eventType]) {
        this._appEvents[eventType]?.(params?.params);
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

  // 整体更新自身节点
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
