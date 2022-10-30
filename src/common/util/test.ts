import EventTree from './EventTree';
import { loadScript } from '~util/common';
import { scriptEntry, scriptDir } from '~store/global';

const events = loadScript(`${scriptDir}/${scriptEntry}`);
// console.log('=============== Parser ================');
console.dir(events, { depth: null });
EventTree.loadEvents(events);
// EventTree.show();
console.log(1, EventTree.getNextNode());
console.log(2, EventTree.getNextNode());
console.log(3, EventTree.getNextNode());
console.log(4, EventTree.getNextNode({ label: 't2' }));
console.log(5, EventTree.getNextNode());
// console.log(EventTree.gotoByHash('5'));
