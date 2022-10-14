import BasicView from '~component/BasicView';

export default class Button extends BasicView {
  constructor() {
    super();
    this.initEvent();
  }

  template() {
    return `
    <button>button</button>
    `;
  }

  initEvent() {
    this.addEventListener('click', e => {
      console.log('点击 button');
      e.preventDefault();
    });
  }
}
