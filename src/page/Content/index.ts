import BasicView from '~component/BasicView';
import './index.scss';

export default class Content extends BasicView {
  constructor() {
    super();
  }

  template() {
    return `
    <div class='Content'>
      <div>Content</div>
    </div>
    `;
  }
}
