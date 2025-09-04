import fs from 'node:fs/promises';
import path from 'node:path';

import { conjoin, fillTemplate, plural } from '@technobuddha/library';
import { type TypeDocOptions } from 'typedoc';
import { type MarkdownRendererEvent } from 'typedoc-plugin-markdown';

import { analyzePages } from './analyze-pages.ts';
import { reflectionKind } from './reflection-kind.ts';

export async function updateRepository(
  entryPoint: string,
  renderer: MarkdownRendererEvent,
): Promise<void> {
  return import(path.join(entryPoint, 'typedoc.config.js'))
    .then(async (imported) => {
      const config: TypeDocOptions = imported.default ?? {};

      const { name } = config;
      if (name) {
        return fs
          .readFile(path.join(entryPoint, 'doc/README.md'), 'utf8')
          .then(async (readme) => {
            const pages = analyzePages(renderer, name);

            const counts = pages.reduce<Record<number, number>>((acc, page) => {
              acc[page.kind] = (acc[page.kind] ?? 0) + 1;
              return acc;
            }, {});

            const total = conjoin(
              Object.entries(counts)
                .sort(([a], [b]) =>
                  reflectionKind[Number(a)].localeCompare(reflectionKind[Number(b)]),
                )
                .map(([kind, count]) => plural(reflectionKind[Number(kind)], count, true)),
            );

            const fill = { total };

            return fs.writeFile(path.join(entryPoint, 'README.md'), fillTemplate(readme, fill));
          })
          .catch(() => undefined);
      }
      return undefined;
    })
    .catch(() => undefined);
}
