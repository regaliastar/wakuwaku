import glob from 'glob';
import { RoutePath } from '~interface/index';
import { getHash } from '~util/index';
import BasicView from '~component/BasicView';
import Container from '~util/Container';

// 支持 hashHistory
class Router {
  _root!: HTMLElement | null;
  _pagePaths: Array<RoutePath> = []; // 保存注册过的页面路由
  constructor() {
    this.init();
  }

  init() {
    this.registerAuto();
    location.hash = '';
    window.addEventListener('hashchange', async () => {
      const hash = getHash();
      const path = this._pagePaths.find(v => v.path === hash);
      if (path) {
        const component = await import(`~page/${path.component}`);
        Container.bindPage(new component.default());
        this.refresh(Container._currentPage);
        return;
      }
      throw new Error(`找不到路径: ${hash}, 已注册路由：${JSON.stringify(this._pagePaths)}`);
    });
  }

  registerRoot(root: HTMLElement | null) {
    this._root = root;
  }

  registerAuto() {
    glob.sync(`src/page/*`).forEach(async filepath => {
      const regResult = new RegExp('/([a-zA-Z_]*$)').exec(filepath);
      const compName = regResult ? regResult[1] : null;
      if (compName) {
        this.registerPage(compName, compName);
      }
    });
  }

  registerPage(path: string, componentPath: string) {
    if (this._pagePaths.find(_path => _path.path === path) !== undefined) {
      console.error(`存在已注册页面 ${path}`);
      return;
    }
    this._pagePaths.push({ path, component: componentPath });
  }

  // 重绘页面
  refresh(component: BasicView | undefined) {
    if (this._root === null || component === undefined) {
      return;
    }
    while (this._root.hasChildNodes()) {
      if (this._root.firstChild) {
        this._root.removeChild(this._root.firstChild);
      }
    }
    this._root.appendChild(component._el);
    // 触发事件
    component.triggerChildrenEvent('onMount');
  }
}

export default new Router();
