import { SecenEvent, SecenEventType } from '~interface/parser';
import { loadScript } from '~util/common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventFnType = (result?: any) => void;
/** 事件订阅容器 */
class Container {
  _currentEventIndex: number;
  _events: SecenEvent[][];
  _appEvents: Record<SecenEventType, Array<EventFnType>> = {
    say: [],
    aside: [],
    bgmChange: [],
    bgChange: [],
    charactorChange: [],
    voiceChange: [],
    sperateEvent: [],
  };
  constructor() {
    this._currentEventIndex = 0;
    this._events = loadScript('drama/test.txt');
  }

  bindScript(path: string) {
    this._events = loadScript(`drama/${path}`);
  }

  registerEvent(type: SecenEventType, fn: EventFnType) {
    if (this._appEvents[type].some(f => f === fn)) {
      throw new Error(`不能重复注册相同的函数: ${fn.toString()}, ${this._appEvents[type].toString()}`);
    }
    this._appEvents[type].push(fn);
  }

  removeEvent(removeFn: EventFnType) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    (Object.keys(_this._appEvents) as SecenEventType[]).forEach(type => {
      if (_this._appEvents[type].length) {
        _this._appEvents[type] = _this._appEvents[type].filter(f => f !== removeFn);
      }
    });
  }

  async triggerNextEvent() {
    if (this._currentEventIndex >= this._events.length) {
      return null;
    }
    const event = this._events[this._currentEventIndex];
    console.log(event);
    const res = await Promise.all(
      event.map(instruction => {
        return new Promise<void>((resolve, reject) => {
          try {
            this._appEvents[instruction.type].forEach(fn => {
              fn(instruction.value);
            });
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      }),
    );
    this._currentEventIndex += 1;
    return res;
  }
}

export default new Container();
