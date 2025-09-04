import fs from 'node:fs/promises';
import path from 'node:path';

import { main, type Project } from '@technobuddha/builder';

const home = path.join(import.meta.dirname, '..');
const dirSrc = path.join(home, 'src');
const dirDist = path.join(home, 'dist');

const projects: Project[] = [
  {
    label: 'Plugin',
    log: 'plugin',
    directory: dirSrc,
    steps: [[`rm -rf ${dirDist}`, `tsc -p ${dirSrc}`]],
  },
  {
    label: 'Doc',
    log: 'doc',
    directory: dirDist,
    steps: [[`npx typedoc`, `cp -r public docs`]],
  },
  {
    label: 'VitePress',
    log: 'vitepress',
    steps: [['vitepress build']],
  },
];

await fs.rm(dirDist, { recursive: true, force: true });
await main(projects);
