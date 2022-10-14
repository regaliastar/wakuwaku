import { RoutePath } from '~interface/routes';
import { getHash } from '~util/index';

// 支持 hashHistory
class Router {
  _root!: HTMLElement | null;
  _history: Array<string> = [];
  _pagePaths: Array<RoutePath> = []; // 保存注册过的页面路由
  constructor() {
    this.init();
  }

  init() {
    window.addEventListener('hashchange', () => {
      const hash = getHash();
      const path = this._pagePaths.find(v => v.path === hash);
      if (path?.component) {
        this.refresh(path?.component);
        return;
      }
      throw new Error(`找不到路径: ${hash}, ${JSON.stringify(this._pagePaths)}`);
    });
  }

  registerRoot(root: HTMLElement | null) {
    this._root = root;
  }

  registerPage(path: string, component: HTMLElement) {
    this._pagePaths.push({
      path,
      component,
    });
  }

  // 重绘页面
  refresh(component: HTMLElement) {
    if (this._root === null) {
      return;
    }
    while (this._root.hasChildNodes()) {
      if (this._root.firstChild) {
        this._root.removeChild(this._root.firstChild);
      }
    }
    this._root.appendChild(component);
  }
}

export default new Router();
