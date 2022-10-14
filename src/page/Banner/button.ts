import BasicView from '~component/BasicView';

export default class Button extends BasicView {
  constructor() {
    super();
  }

  template() {
    return `
    <a href='#Content'>enter Content</a>
    `;
  }
}
