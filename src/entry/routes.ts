import glob from 'glob';
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
    this.registerAuto();
    location.hash = '';
    window.addEventListener('hashchange', () => {
      const hash = getHash();
      const path = this._pagePaths.find(v => v.path === hash);
      if (path?.component) {
        this.refresh(path?.component);
        return;
      }
      throw new Error(`找不到路径: ${hash}, 已注册页面：${JSON.stringify(this._pagePaths)}`);
    });
  }

  registerRoot(root: HTMLElement | null) {
    this._root = root;
  }

  registerAuto() {
    glob.sync(`src/page/*`).forEach(async filepath => {
      const regResult = new RegExp('/([a-zA-Z_]*$)').exec(filepath);
      /* eslint-disable @typescript-eslint/prefer-optional-chain */
      const compName = regResult && regResult[1];
      if (compName) {
        const component = await import(`~page/${compName}`);
        this.registerPage(compName as unknown as string, new component.default()._el);
      }
    });
  }

  registerPage(path: string, component: HTMLElement) {
    if (this._pagePaths.find(_path => _path.path === path) !== undefined) {
      console.error(`存在已注册页面 ${path}`);
      return;
    }
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
