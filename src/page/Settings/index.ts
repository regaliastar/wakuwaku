import BasicView from '~component/BasicView';
import './index.scss';

export default class Settings extends BasicView {
  constructor() {
    super();
  }

  template() {
    return `
    <div class='Settings'>
      <div>Settings</div>
    </div>
    `;
  }
}
