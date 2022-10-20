import { SecenEvent, ReadyStateType } from '~interface/parser';

// IoC 容器
class Container {
  _readyState: Map<ReadyStateType, boolean>; // 当所有状态都为 true 时，才能执行下一个指令
  _secenEvents: SecenEvent[][] = [];
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

  bindSecenEvents(secenEvents: SecenEvent[][]) {
    this._secenEvents = secenEvents;
  }

  // 触发事件后由触发者执行自己注册的函数，Container 不关注具体实现细节
  // async execNextEvent(page: BasicView): Promise<boolean> {
  //   const event = this._secenEvents[this._curEventIndex];
  //   console.log('execNextEvent', this.isSecenReady(), event);
  //   if (this._curEventIndex >= this._secenEvents.length) {
  //     this.gameOver();
  //     return false;
  //   }
  //   if (!this.isSecenReady()) {
  //     return false;
  //   }
  //   await Promise.all(
  //     event.map(instruction => {
  //       return new Promise<void>(resolve => {
  //         const { type, value } = instruction;
  //         page.triggerChildrenEvent(type, { params: value, once: type === 'say' ? false : true });
  //         resolve();
  //       });
  //     }),
  //   );
  //   this._curEventIndex += 1;
  //   return true;
  // }

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
