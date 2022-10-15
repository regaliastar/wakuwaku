/* eslint-disable @typescript-eslint/no-explicit-any */
import { createElement } from '~util/index';

export default class BasicView {
  _appEvents: Record<string, any> = {};
  _el: HTMLDivElement;
  _componentName = '';
  _children: Record<string, BasicView> = {};
  _father: BasicView | undefined;
  _data: Record<string, string | unknown> = {}; // 组件数据通信

  constructor(_args?: any) {
    this._el = this.getHtmlNode(_args);
  }

  // eslint-disable-next-line
  template(_args?: any): string {
    return '';
  }

  setData(name: string, value: Record<string, unknown> | string | unknown) {
    this._data[name] = value;
  }

  getHtmlNode(_args?: any): HTMLDivElement {
    const node = createElement(this.template(_args));
    return node;
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

  // 父子通信，子组件可以调用父组件的方法
  // 控制反转思路，子组件抛出方法让父组件执行，而不需要关注父组件具体方法实现。
  trigger(eventName: string, ...data: any) {
    const parent = this._father;
    if (parent) {
      const componentName = this._componentName;
      parent.emitComponentEvent(eventName, componentName, ...data);
      // 冒泡
      parent.trigger(eventName, ...data);
    }
  }

  // todo
  emitComponentEvent(event: string, componentName: string, ...data: any) {
    const delegateEventSplitter = /^(\S+)\s*(\S+)$/;
    Object.keys(this._appEvents).forEach(key => {
      const funcName = this._appEvents[key];
      const match = key.match(delegateEventSplitter);
      const eventName = match ? match[1] : null;
      const selector = match ? match[2] : null;
      if (selector === componentName && event === eventName) {
        // eslint-disable-next-line @typescript-eslint/ban-types
        const fn = this[funcName as keyof BasicView] as Function;
        fn?.(...data);
      }
    });
  }

  // todo
  remove() {
    return null;
  }
}
