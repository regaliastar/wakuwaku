import { atom, selector } from 'recoil';
import { v4 as uuidv4 } from 'uuid';
import { CharactarSay } from '~interface/parser';

export const typingDone = atom({
  key: uuidv4(),
  default: false,
});

export const vedioDone = atom({
  key: uuidv4(),
  default: true,
});

export const toolbarVisiable = atom({
  key: uuidv4(),
  default: true,
});

export const hasAllReady = selector({
  key: uuidv4(),
  get: ({ get }) => {
    return get(typingDone) && get(vedioDone) && get(toolbarVisiable) && !get(auto);
  },
});

export const hasAllReadyInAuto = selector({
  key: uuidv4(),
  get: ({ get }) => {
    return get(typingDone) && get(vedioDone);
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
