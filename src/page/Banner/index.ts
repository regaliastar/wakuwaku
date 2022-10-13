import BasicView from '~component/BasicView';

export default class Banner extends BasicView {
  el: string;
  constructor() {
    super();
    this.el = this.template();
  }

  template() {
    return `<div class='Banner'>
      <p>图片</p>
      <button id='newGame'>新游戏</button>
      <button id='save'>存档</button>
      <button id='setting'>设置</button>
    </div>`;
  }

  getHtmlNode(): HTMLDivElement {
    return super.getHtmlNode();
  }
}
