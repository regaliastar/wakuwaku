import EventTree from './EventTree';
import { loadScript } from '~util/common';

const events = loadScript('drama/test.txt');
// console.log('=============== Parser ================');
console.dir(events, { depth: null });
EventTree.loadEvents(events);
EventTree.show();
// console.log(1, EventTree.getNextEvent());
// console.log(2, EventTree.getNextEvent({ label: 'label2' }));
// console.log(3, EventTree.getNextEvent());
console.log(EventTree.gotoByHash('5'));
