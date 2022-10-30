import path from 'path';
import fs from 'fs';
import yaml from 'yamljs';

export const { scriptEntry, scriptDir, bgDir, charactorDir } = yaml.parse(
  fs.readFileSync(path.join(__dirname, '..', '..', 'config.yml')).toString(),
);
