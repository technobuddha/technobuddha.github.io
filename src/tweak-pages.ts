import fs from 'node:fs/promises';

import { camelCase, splitLines } from '@technobuddha/library';

import { type Page } from './analyze-pages.ts';
import { header } from './header.ts';

export async function tweakPages(pages: Page[], packageName: string): Promise<void> {
  for (const page of pages) {
    const { url, group, category } = page;

    const lines = splitLines(await fs.readFile(`./doc/${url}`, 'utf8'));
    lines.splice(
      header.length,
      2,
      `[@technobuddha](../index.md) > [${packageName}](../${packageName}.md) > [${group}](index_${camelCase(group)}.md) > [${category}](index_${camelCase(group)}_${camelCase(category)}.md)`,
    );

    lines[4] = lines[4].replace(/^# Variable:/u, '# Constant:');

    await fs.writeFile(`./doc/${url}`, lines.join('\n'), 'utf8');
  }
}
