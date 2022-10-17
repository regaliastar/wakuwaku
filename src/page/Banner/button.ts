import BasicView from '~component/BasicView';
import { ConstructorParams } from '~interface/index';
import './button.scss';

interface btnParams extends ConstructorParams {
  id: string;
  text: string;
  href: string;
}

export default class Button extends BasicView {
  constructor(options: btnParams) {
    super(options);
  }

  template(options: btnParams) {
    return `
    <div class='button'>
      <a href='${options.href}' id='${options.id}'>${options.text}</a>
    </div>
    `;
  }
}
