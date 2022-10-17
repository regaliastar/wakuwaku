import * as fs from 'fs';
import BasicView from '~component/BasicView';
import { SecenEvent, ReadyStateType } from '~interface/index';
import { Scanner, Parser } from '~util/Parser';

// IoC 容器
class Container {
  _currentPage: BasicView | undefined;
  _readyState: Map<ReadyStateType, boolean>; // 当所有状态都为 true 时，才能执行下一个指令
  _secenEvents: SecenEvent[] = [];
  _curEventIndex: number; // 当前触发场景事件
  constructor() {
    this._readyState = new Map();
    this._curEventIndex = 0;
  }

  isSecenReady() {
    let flag = true;
    this._readyState.forEach(value => {
      if (!value) {
        flag = false;
      }
    });
    return flag;
  }

  bindPage(component: BasicView) {
    this._currentPage = component;
  }

  loadDrama(filepath: string) {
    if (!fs.existsSync(filepath)) {
      throw new Error(`${filepath} 文件不存在`);
    }
    const text = fs.readFileSync(filepath, { encoding: 'utf8', flag: 'r' });
    const tokens = Scanner(text);
    const events = Parser(tokens);
    this.bindSecenEvents(events);
  }

  bindSecenEvents(secenEvents: SecenEvent[]) {
    this._secenEvents = secenEvents;
  }

  // 触发事件后由触发者执行自己注册的函数，Container 不关注具体实现细节
  execNextEvent(node: BasicView): boolean {
    console.log('execNextEvent', this.isSecenReady(), this._secenEvents[this._curEventIndex]);
    if (this._curEventIndex >= this._secenEvents.length) {
      this.gameOver();
      return false;
    }
    if (!this.isSecenReady()) {
      return false;
    }
    const { type, value } = this._secenEvents[this._curEventIndex];
    node.triggerChildrenEvent(type, { params: value, once: true });
    this._curEventIndex += 1;
    return true;
  }

  setReadyState(key: ReadyStateType, value: boolean) {
    this._readyState.set(key, value);
  }

  getReadyState(key: ReadyStateType): boolean {
    const state = this._readyState.get(key);
    if (state === undefined) {
      throw new Error(`找不到元素 ${state}`);
    }
    return state;
  }

  gameOver() {
    console.log('gameOver');
  }
}

export default new Container();
