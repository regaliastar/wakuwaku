import BasicView from '~page/BasicView';

export default class Banner extends BasicView {
  el: string;
  constructor() {
    super();
    this.el = '';
  }

  template() {
    return `<div class='Banner'>
      <button>新游戏</button>
      <button>存档</button>
      <button>设置</button>
    </div>`;
  }
}
