import path from 'node:path';

import { main, type Project } from '@technobuddha/builder';

const home = path.join(import.meta.dirname, '..');
const dirSrc = path.join(home, 'src');
const dirDist = path.join(home, 'dist');
const dirDocs = path.join(home, 'docs');
const dirVitePress = path.join(home, '.vitepress', 'dist');

const projects: Project[] = [
  {
    label: 'Plugin',
    steps: [`rm -rf ${dirDist}`, `tsc -p ${dirSrc}`],
  },
  {
    label: 'Doc',
    steps: [`npx typedoc`, `cp -r public doc`],
  },
  {
    label: 'VitePress',
    steps: ['npx vitepress build'],
  },
  {
    label: 'Deploy',
    steps: [`rm -rf ${dirDocs}`, `mkdir -p ${dirDocs}`, `cp -r ${dirVitePress}/* ${dirDocs}`],
  },
];

await main(projects);
