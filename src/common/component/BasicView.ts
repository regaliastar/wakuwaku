export default class BasicView {
  appEvents: string[];
  el: string;
  constructor() {
    this.appEvents = [];
    this.el = '';
  }

  template(): string {
    return '';
  }

  getHtmlNode(): HTMLDivElement {
    const node = document.createElement('div');
    node.innerHTML = this.template();
    node.addEventListener('click', e => {
      const target = e.target as HTMLTextAreaElement;
      if (target.type === 'submit') {
        // 跳转
        console.log(target.id);
      }
    });
    return node;
  }
}
