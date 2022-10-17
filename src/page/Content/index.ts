import wordPanel from './wordPanel';
import BasicView from '~component/BasicView';
import { EventFnParams } from '~interface/index';
import { createElement } from '~util/index';
import Container from '~util/Container';
import './index.scss';

export default class Content extends BasicView {
  constructor() {
    super();
    this._el.addEventListener('click', e => {
      e.preventDefault();
      if (!Container.getReadyState('typingDone')) {
        this.triggerChildrenEvent('stopTyping');
        return;
      }
      Container.execNextEvent(this);
    });
    this.registerEvent('onMount', () => {
      Container.execNextEvent(this);
    });
    this.registerEvent('bgChange', (result: EventFnParams) => {
      if (result) {
        this.setBg(result as string);
      }
    });
  }

  render(): HTMLDivElement {
    const eleGroup = [this.registerChildComponent('newGame', new wordPanel({ text: '初始文本...' }))];
    const node = createElement(this.template());
    eleGroup.forEach(ele => {
      node?.appendChild(ele._el);
    });
    return node;
  }

  setBg(bgName: string) {
    const bgNode = document.getElementById('bg');
    if (bgNode) {
      bgNode.style.backgroundImage = `url(drama/img/${bgName})`;
    }
  }

  template() {
    return `
    <div class='Content'>
      <div id='bg' class='bg'></div>
      <div class='character'></div>
    </div>
    `;
  }
}
