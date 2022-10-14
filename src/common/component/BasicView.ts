/* eslint-disable @typescript-eslint/no-explicit-any */
export default class BasicView {
  _appEvents: { [key: string]: any } = {};
  _el: HTMLElement;
  _componentName = '';
  _children: { [key: string]: any } = {};
  _father: BasicView | undefined;
  _data: { [key: string]: any } = {}; // 组件数据通信

  constructor() {
    this._el = this.getHtmlNode();
  }

  template(): string {
    return '';
  }

  setData(name: string, value: unknown) {
    this._data[name] = value;
  }

  getHtmlNode(): HTMLElement {
    const node = document.createElement('div');
    node.innerHTML = this.template();
    return node;
  }

  addEventListener(
    type: string,
    fn: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions | undefined,
  ) {
    this._el.addEventListener(type, fn, options);
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

  remove() {
    return null;
  }
}
