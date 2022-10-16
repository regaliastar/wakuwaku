import { fsLoader } from '~util/index';
import { Scanner, Parser } from '~util/Parser';

import Container from '~util/Container';

const main = () => {
  const text = fsLoader('drama/test.txt');
  const tokens = Scanner(text);
  const events = Parser(tokens);
  console.log('events', events);
  Container.bindSecenEvents(events);
};

export default main;
