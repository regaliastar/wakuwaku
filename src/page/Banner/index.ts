import Button from './button';
import BasicView from '~component/BasicView';
import './index.scss';

const handleHrefEvent = (e: Event) => {
  const target = e.target as HTMLTextAreaElement;
  if (target.type === 'submit') {
    // 跳转
    console.log('跳转: ' + target.id);
    e.preventDefault();
  }
};
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
    const btn1 = this.registerChildComponent('btn1', new Button());

    const node = document.createElement('div');
    node.innerHTML = this.template();
    node.appendChild(btn1._el);
    return node;
  }

  initEvent() {
    this.addEventListener('click', handleHrefEvent);
  }
}
