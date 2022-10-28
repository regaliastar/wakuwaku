import EventTree from './EventTree';
import { loadScript } from '~util/common';

const events = loadScript('drama/t1.txt');
console.log('=============== Parser ================');
console.dir(events, { depth: null });
EventTree.loadEvents(events);
EventTree.show();
console.log('=============== Root ================');
console.dir(EventTree.root.children, { depth: null });
