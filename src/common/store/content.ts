import { atom, selector } from 'recoil';
import { v4 as uuidv4 } from 'uuid';
import { CharactarSay } from '~interface/parser';

interface ReadyStateType {
  typingDone?: boolean;
  vedioDone?: boolean;
}

export const readyState = atom({
  key: uuidv4(),
  default: <ReadyStateType>{
    typingDone: false, // 初始化时默认开始打字
    vedioDone: true,
  },
});

export const hasAllReady = selector({
  key: uuidv4(),
  get: ({ get }) => {
    return Object.values(get(readyState)).every(_ => _);
  },
});

export const stopTyping = atom({
  key: uuidv4(),
  default: false,
});

export const currentCharactarSay = atom({
  key: uuidv4(),
  default: <CharactarSay>{
    name: '',
    text: '',
  },
});

export const auto = atom({
  key: uuidv4(),
  default: false,
});
