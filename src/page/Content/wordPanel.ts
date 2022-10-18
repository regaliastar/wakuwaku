import BasicView from '~component/BasicView';
import Container from '~util/Container';
import './wordPanel.scss';

const typeText = () => {
  const container = document.querySelector('#textInPanel');
  const nodes = container?.querySelectorAll('span');
  Container.setReadyState('typingDone', false);
  function core(step: number) {
    if (Container.getReadyState('typingDone') === true) return;
    if (nodes?.length && step >= nodes.length) {
      Container.setReadyState('typingDone', true);
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

const getWordGroupBySpan = (text: string): string => {
  return text
    .split('')
    .map(ch => {
      return `<span style = 'opacity: 0'>${ch}</span>`;
    })
    .join('');
};

export default class wordPanel extends BasicView {
  constructor() {
    super();
    this.registerEvent('onMount', () => {
      typeText();
    });
    this.registerEvent('stopTyping', () => {
      const container = document.querySelector('#textInPanel');
      const nodes = container?.querySelectorAll('span');
      nodes?.forEach(n => {
        n.className = 'show';
      });
      Container.setReadyState('typingDone', true);
    });
    this.registerEvent('say', result => {
      this.updateCharactorName(result?.name);
      this.updataText(result?.text);
      typeText();
    });
    this.registerEvent('aside', result => {
      this.updateCharactorName('');
      this.updataText(result);
      typeText();
    });
  }

  template() {
    return `
    <div class='wordPanel'>
      <div id='charactorName'></div>
      <div class='text' id='textInPanel'>
        <div id='textGroup'></div>
      </div>
    </div>
    `;
  }

  // todo: MVVM 实现
  updataText(text: string | undefined) {
    const textPanel = document.getElementById('textInPanel');
    if (text === undefined || !textPanel) {
      return;
    }
    textPanel.innerHTML = `<div id='textGroup'>${getWordGroupBySpan(text)}</div>`;
  }

  updateCharactorName(name: string) {
    const textPanel = document.getElementById('charactorName');
    if (!textPanel || name === undefined) {
      return;
    }
    textPanel.innerText = name;
  }
}
