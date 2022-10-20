import * as fs from 'fs';
import { Scanner, Parser } from '~util/parser';

export const loadScript = (filepath: string) => {
  if (!fs.existsSync(filepath)) {
    throw new Error(`${filepath} 文件不存在`);
  }
  const text = fs.readFileSync(filepath, { encoding: 'utf8', flag: 'r' });
  const tokens = Scanner(text);
  const events = Parser(tokens);
  return events;
};
