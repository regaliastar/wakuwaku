import { atom, selector } from 'recoil';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { loadScript } from '~util/common';

const SecenEvents = atom({
  key: uuidv4(),
  default: loadScript('drama/test.txt'),
});

export const step = atom({
  key: uuidv4(),
  default: 0,
});

export const currentEvent = selector({
  key: uuidv4(),
  get: ({ get }) => {
    const index = get(step);
    const secenEvents = get(SecenEvents);
    if (index < secenEvents.length) {
      return secenEvents[index];
    }
    return null;
  },
});

export const history = selector({
  key: uuidv4(),
  get: ({ get }) => {
    const index = get(step);
    const events = get(SecenEvents).slice(0, index);
    const history = events.map(event => {
      return event.filter(inst => inst.type === 'aside' || inst.type === 'say');
    });
    const res = history.flat().map(h => {
      if (h.type === 'aside') {
        return {
          name: '',
          text: h.value as string,
        };
      }
      if (!_.isArray(h.value) && !_.isString(h.value)) {
        return {
          name: h.value.name,
          text: h.value.text,
        };
      }
      return null;
    });
    return res.filter(item => item !== null);
  },
});
