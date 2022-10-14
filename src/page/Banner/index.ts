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
      <a href='#'>reset hash</a>
    </div>
    `;
  }

  getHtmlNode(): HTMLDivElement {
    const btn1 = this.registerChildComponent('btn1', new Button());
    const node = createElement(this.template());
    node?.appendChild(btn1._el);
    return node;
  }

  initEvent() {
    // this._el.addEventListener('click', handleHrefEvent);
  }
}
