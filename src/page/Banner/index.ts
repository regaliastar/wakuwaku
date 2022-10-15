import Button from './button';
import BasicView from '~component/BasicView';
import { createElement } from '~util/index';
import './index.scss';

export default class Banner extends BasicView {
  constructor() {
    super();
    this._el = this.getHtmlNode();
    this.initEvent();
  }

  template() {
    return `
    <div class='Banner'>
    </div>
    `;
  }

  getHtmlNode(): HTMLDivElement {
    const btnGroup = [
      this.registerChildComponent('newGame', new Button({ id: 'newGame', text: '开始游戏', href: '#Content' })),
      this.registerChildComponent('save', new Button({ id: 'save', text: '保存', href: '#Save' })),
      this.registerChildComponent('settings', new Button({ id: 'settings', text: '设置', href: '#Settings' })),
    ];
    const node = createElement(this.template());
    btnGroup.forEach(btn => {
      node?.appendChild(btn._el);
    });
    return node;
  }

  initEvent() {
    // this._el.addEventListener('click', handleHrefEvent);
  }
}
