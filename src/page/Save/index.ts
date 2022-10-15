import BasicView from '~component/BasicView';
import './index.scss';

export default class Save extends BasicView {
  constructor() {
    super();
  }

  template() {
    return `
    <div class='Save'>
      <div>Save</div>
    </div>
    `;
  }
}
