import BasicView from '~component/BasicView';
import { createElement } from '~util/index';
import './wordPanel.scss';

interface wordPrams {
  text: string;
}

const typeText = async () => {
  const container = document.querySelector('#textInPanel');
  const nodes = container?.querySelectorAll('span');
  function core(step: number) {
    if (shouldTyping === false) return;
    if (nodes?.length && step >= nodes.length) {
      return;
    }
    setTimeout(() => {
      if (nodes?.[step]) {
        nodes[step].className = 'fadeout';
      }
      core(step + 1);
    }, 100);
  }
  core(0);
};

let shouldTyping = true;

export default class wordPanel extends BasicView {
  constructor(options: wordPrams) {
    super(options);
    this._el.addEventListener('click', e => {
      shouldTyping = false;
      const container = document.querySelector('#textInPanel');
      const nodes = container?.querySelectorAll('span');
      nodes?.forEach(n => {
        n.className = 'show';
      });
      e.preventDefault();
    });
    this.registerEvent('onMount', () => {
      typeText();
    });
  }

  template(options: wordPrams) {
    const txtGroupBySpan = options.text
      .split('')
      .map(ch => {
        return `<span style = 'opacity: 0'>${ch}</span>`;
      })
      .join('');
    return `
    <div class='wordPanel'>
      <div class='text' id='textInPanel'>
        ${txtGroupBySpan}
      </div>
    </div>
    `;
  }

  setText(options: wordPrams) {
    this.updateComponent(createElement(this.template(options)));
  }
}
