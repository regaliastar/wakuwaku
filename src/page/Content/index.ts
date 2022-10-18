import wordPanel from './wordPanel';
import BasicView from '~component/BasicView';
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
    this.registerEvent('bgChange', result => {
      if (result) {
        this.setBg(result as string);
      }
    });
    this.registerEvent('charactorChange', result => {
      if (result) {
        this.changeCharactor(result);
      }
    });
    this.registerEvent('say', result => {
      this.activeCharactor(result.name);
    });
  }

  render(): HTMLDivElement {
    const eleGroup = [this.registerChildComponent('newGame', new wordPanel())];
    const node = createElement(this.template());
    eleGroup.forEach(ele => {
      node?.appendChild(ele._el);
    });
    return node;
  }

  setBg(bgName: string) {
    const bgNode = document.getElementById('bg');
    if (bgNode) {
      bgNode.style.backgroundImage = `url(drama/bg/${bgName})`;
    }
  }

  changeCharactor(names: string[]) {
    const charactorNode = document.getElementById('charactor');
    if (!charactorNode || !names) {
      return;
    }
    charactorNode.innerHTML = names
      .map(name => {
        return `<img id=${name} class='selector charactorImg' src='drama/charactor/${name}.png'>`;
      })
      .join('');
  }

  activeCharactor(name: string) {
    const node = document.getElementById(name);
    if (node) {
      node.classList.add('active');
    }
  }

  template() {
    return `
    <div class='Content'>
      <div id='bg' class='bg'>
        <div id='charactor' class='charactor'></div>
      </div>
    </div>
    `;
  }
}
