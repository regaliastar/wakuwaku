/* eslint-disable @typescript-eslint/no-explicit-any */
import { BasicViewInterface } from '~interface/index';
import { createElement } from '~util/index';

enum EventTypeEnum {
  'onMount', // 页面加载完毕
}
type EventType = keyof typeof EventTypeEnum;

export default class BasicView implements BasicViewInterface {
  _appEvents: Record<EventType, any> = {
    onMount: undefined,
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

  registerEvent(type: EventType, fn: any) {
    if (this._appEvents[type]) {
      throw new Error(`存在已注册事件 ${type}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    const currying = (fn: any) => {
      return () => {
        fn.call(_this);
      };
    };
    this._appEvents[type] = currying(fn);
  }

  // 与父组件通信，控制反转，子组件抛出方法让父组件执行，而不需要关注父组件具体方法实现。
  triggerFatherEvent(eventType: EventType, componentName?: string) {
    if (this._father) {
      if (this._father._componentName === componentName && this._father._appEvents[eventType]) {
        this._father._appEvents[eventType]();
        return;
      }
      this._father.triggerFatherEvent(eventType, componentName);
    }
  }

  // 触发子组件和自身事件
  triggerChildrenEvent(eventType: EventType, componentName?: string) {
    if (componentName) {
      if (this._componentName === componentName && this._appEvents[eventType]) {
        this._appEvents[eventType]();
        return;
      }
    } else {
      // 没有传递 componentName，全触发
      if (this._appEvents[eventType]) {
        this._appEvents[eventType]();
      }
    }
    if (this._children) {
      Object.keys(this._children).forEach((key: string) => {
        this._children[key].triggerChildrenEvent(eventType, componentName);
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

  // 父子通信，子组件可以调用父组件的方法
  // 控制反转思路，子组件抛出方法让父组件执行，而不需要关注父组件具体方法实现。
  // trigger(eventName: string, ...data: any) {
  //   if (this._father) {
  //     // const componentName = this._componentName;
  //     // this._father.emitComponentEvent(eventName, componentName, ...data);
  //     // 冒泡
  //     this._father.trigger(eventName, ...data);
  //   }
  // }

  // todo
  // emitComponentEvent(event: string, componentName: string, ...data: any) {
  //   const delegateEventSplitter = /^(\S+)\s*(\S+)$/;
  //   Object.keys(this._appEvents).forEach(key => {
  //     const funcName = this._appEvents[key];
  //     const match = key.match(delegateEventSplitter);
  //     const eventName = match ? match[1] : null;
  //     const selector = match ? match[2] : null;
  //     if (selector === componentName && event === eventName) {
  //       // eslint-disable-next-line @typescript-eslint/ban-types
  //       const fn = this[funcName as keyof BasicView] as Function;
  //       fn?.(...data);
  //     }
  //   });
  // }

  remove() {
    if (this._father) {
      this._father._el.removeChild(this._el);
    }
  }
}
