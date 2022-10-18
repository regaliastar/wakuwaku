import BasicView from '~component/BasicView';
import { ConstructorParams } from '~interface/index';

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
    <a href='${options.href}' id='${options.id}'>${options.text}</a>
    `;
  }
}
