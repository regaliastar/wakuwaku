import { atom, selector } from 'recoil';
import { v4 as uuidv4 } from 'uuid';
import { loadScript } from '~util/common';

const SecenEvents = atom({
  key: uuidv4(),
  default: loadScript('drama/test.txt'),
});

export const currentEventIndex = atom({
  key: uuidv4(),
  default: 0,
});

export const currentEvent = selector({
  key: uuidv4(),
  get: ({ get }) => {
    const index = get(currentEventIndex);
    const secenEvents = get(SecenEvents);
    if (index < secenEvents.length) {
      return secenEvents[index];
    }
    return null;
  },
});
