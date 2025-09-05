import fs from 'node:fs/promises';
import path from 'node:path';

import { camelCase, conjoin, fillTemplate, plural, space } from '@technobuddha/library';
import { type TypeDocOptions } from 'typedoc';
import { type MarkdownRendererEvent } from 'typedoc-plugin-markdown';

import { analyzePages, type Page } from './analyze-pages.ts';
import { reflectionKind } from './reflection-kind.ts';

const URL = 'https://doc.technobuddha.com/';
const WARNING = 'CHANGES TO THIS FILE WILL BE OVERRIDDEN';
const INDENT = `${space}${space}`;
const BANNER = `<!--\n${INDENT}🚨\n${INDENT}🚨${space}${WARNING}\n${INDENT}🚨\n-->\n`;

function summary(pages: Page[]): string {
  const counts = pages.reduce<Record<number, number>>((acc, page) => {
    acc[page.kind] = (acc[page.kind] ?? 0) + 1;
    return acc;
  }, {});

  return conjoin(
    Object.entries(counts)
      .sort(([a], [b]) => reflectionKind[Number(a)].localeCompare(reflectionKind[Number(b)]))
      .map(([kind, count]) => plural(reflectionKind[Number(kind)], count, true)),
  );
}

export async function updateRepository(
  entryPoint: string,
  renderer: MarkdownRendererEvent,
): Promise<void> {
  return import(path.join(entryPoint, 'typedoc.config.js'))
    .then(async (imported) => {
      const config: TypeDocOptions = imported.default ?? {};

      const { name } = config;
      if (name) {
        return fs.readFile(path.join(entryPoint, 'doc/README.md'), 'utf8').then(async (rm) => {
          const readme = rm.replaceAll(
            './',
            'https://raw.githubusercontent.com/technobuddha/library/main/doc/logo.svg',
          );
          const pages = analyzePages(renderer, name);
          const total = summary(pages);

          const groupList = new Set(pages.map((page) => page.group));

          const groups = [
            '| Group | Entities |',
            '| ----- | -------- |',
            ...Array.from(groupList.keys())
              .sort((a, b) => a.localeCompare(b))
              .map((group) => {
                const link = `[${group}](${URL}/library/index_${camelCase(group)}.html)`;
                return `| ${link} | ${summary(pages.filter((page) => page.group === group))} |`;
              }),
          ].join('\n');

          const fill = { total, groups };

          return fs.writeFile(
            path.join(entryPoint, 'README.md'),
            fillTemplate(`${BANNER}${readme}`, fill),
          );
        });
      }
      return undefined;
    })
    .catch(() => undefined);
}
