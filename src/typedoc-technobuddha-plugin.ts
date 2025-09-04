import { empty } from '@technobuddha/library';
import { type MarkdownApplication, MarkdownPageEvent } from 'typedoc-plugin-markdown';

import { analyzePages } from './analyze-pages.ts';
import { createIndices } from './create-indices.ts';
import { header } from './header.ts';
import { tweakPages } from './tweak-pages.ts';
import { tweakSidebar } from './tweak-sidebar.ts';
import { updateRepository } from './update-repository.ts';

const isDevelopment = process.env.NODE_ENV !== 'production';
// const LINK = isDevelopment ? empty : "https://github.com/technobuddha/library/blob/main/";

// eslint-disable-next-line no-console
console.log(isDevelopment ? 'DEVELOPMENT MODE' : 'PRODUCTION MODE');

export function load(app: MarkdownApplication): void {
  app.renderer.markdownHooks.on('page.begin', () => header.join('\n'));
  app.renderer.markdownHooks.on('index.page.begin', () => header.join('\n'));
  app.renderer.on(MarkdownPageEvent.END, (page) => {
    page.contents = page.contents?.replace(/(?<=Defined in: \[)\.?\/?src\//u, empty);
  });

  app.renderer.postRenderAsyncJobs.push(
    async (renderer) => {
      for (const packageName of ['library', 'react-hooks']) {
        const pages = analyzePages(renderer, packageName);
        await Promise.all([
          tweakPages(pages, packageName),
          createIndices(pages, packageName),
          tweakSidebar(packageName),
        ]);
      }
    },
    async (renderer) => {
      await Promise.all(app.entryPoints.map(async (ep) => updateRepository(ep, renderer)));
    },
    // async ({ navigation }) => {
    //   if (navigation) {
    //     await fs.writeFile('doc/navigation.json', JSON.stringify(navigation, null, 2));
    //   }
    // },
  );
}
