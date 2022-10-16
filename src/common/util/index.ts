import * as fs from 'fs';

export const getHash = (): string => {
  const hash = location.hash;
  const path = hash ? hash.substring(1) : '/';
  return path;
};

export const createElement = (html: string): HTMLDivElement => {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstChild as HTMLDivElement;
};

export const fsLoader = (dramaPath: string) => {
  const data = fs.readFileSync(dramaPath, { encoding: 'utf8', flag: 'r' });
  return data;
};
