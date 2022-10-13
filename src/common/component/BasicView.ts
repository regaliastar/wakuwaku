export default class BasicView {
  appEvents: string[];
  el: HTMLDivElement;
  constructor() {
    this.appEvents = [];
    this.el = this.getHtmlNode();
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
