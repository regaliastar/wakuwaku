/* eslint-disable @typescript-eslint/no-empty-function */
import BasicView from '~component/BasicView';

// IoC 容器
class Container {
  _currentPage: BasicView | undefined;
  _data: Map<string, unknown>;
  constructor() {
    this._data = new Map();
  }

  bindPage(component: BasicView) {
    this._currentPage = component;
  }

  addData(key: string, value: unknown) {
    if (this._data.has(key)) {
      throw new Error(`已存在 ${key}`);
    }
    this._data.set(key, value);
  }

  getData(key: string) {
    const page = this._data.get(key);
    if (!page) {
      throw new Error(`找不到data: ${key}`);
    }
    return page;
  }
}

export default new Container();
