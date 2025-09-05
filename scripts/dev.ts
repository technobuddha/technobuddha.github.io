import path from 'node:path';

import { main, type Project } from '@technobuddha/builder';

const home = path.join(import.meta.dirname, '..');
const dirSrc = path.join(home, 'src');
const dirDist = path.join(home, 'dist');

const projects: Project[] = [
  {
    label: 'Plugin',
    directory: dirSrc,
    steps: [`rm -rf ${dirDist}`, `tsc -p ${dirSrc}`],
  },
  {
    label: 'Doc',
    directory: [dirDist, '../@technobuddha/library/doc'],
    steps: [`npx typedoc`, `cp -r public doc`],
  },
  {
    label: 'VitePress',
    daemon: true,
    steps: ['npx vitepress dev'],
  },
];

await main(projects, true);
