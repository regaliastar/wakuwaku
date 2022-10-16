import wordPanel from './wordPanel';
import BasicView from '~component/BasicView';
import { createElement } from '~util/index';
import './index.scss';

export default class Content extends BasicView {
  constructor() {
    super();
    this.registerEvent('onMount', () => {
      this.setBg('1');
    });
    this._el.addEventListener('click', e => {
      e.preventDefault();
    });
  }

  render(): HTMLDivElement {
    const eleGroup = [
      this.registerChildComponent(
        'newGame',
        new wordPanel({ text: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww' }),
      ),
    ];
    const node = createElement(this.template());
    eleGroup.forEach(ele => {
      node?.appendChild(ele._el);
    });
    return node;
  }

  setBg(bgName: string) {
    const bgNode = document.getElementById('bg');
    if (bgNode) {
      bgNode.style.backgroundImage = `url(statics/img/${bgName}.jpg)`;
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
