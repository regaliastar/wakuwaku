import { fsLoader } from '~util/index';
import { Scanner, Parser } from '~util/Parser';

const main = () => {
  const text = fsLoader('drama/test.txt');
  const tokens = Scanner(text);
  const events = Parser(tokens);
  console.log('events', events);
};

export default main;
