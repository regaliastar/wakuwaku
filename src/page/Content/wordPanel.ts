import BasicView from '~component/BasicView';
import { createElement } from '~util/index';
import Container from '~util/Container';
import './wordPanel.scss';

interface wordPrams {
  text: string;
}

const typeText = async () => {
  const container = document.querySelector('#textInPanel');
  const nodes = container?.querySelectorAll('span');
  function core(step: number) {
    if (Container.getReadyState('typing') === true) return;
    if (nodes?.length && step >= nodes.length) {
      Container.setReadyState('typing', true);
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

export default class wordPanel extends BasicView {
  constructor(options: wordPrams) {
    super(options);
    this.registerEvent('onMount', () => {
      Container.setReadyState('typing', false);
      typeText();
    });
    this.registerEvent('stopTyping', () => {
      const container = document.querySelector('#textInPanel');
      const nodes = container?.querySelectorAll('span');
      nodes?.forEach(n => {
        n.className = 'show';
      });
      Container.setReadyState('typing', true);
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
