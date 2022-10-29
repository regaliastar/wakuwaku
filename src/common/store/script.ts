import { atom } from 'recoil';
import { v4 as uuidv4 } from 'uuid';

/** 表示事件走过一步 */
export const step = atom({
  key: uuidv4(),
  default: 0,
});

export const hash = atom({
  key: uuidv4(),
  default: '0',
});
