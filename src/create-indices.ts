import fs from 'node:fs/promises';

import {
  camelCase,
  capitalize,
  conjoin,
  empty,
  escapeHTML,
  initials,
  plural,
} from '@technobuddha/library';

import { type Page } from './analyze-pages.ts';
import { header } from './header.ts';
import { reflectionKind } from './reflection-kind.ts';

function counts(group: string, category: string, pages: Page[]): string {
  const kinds = pages
    .filter((p) => p.group === group && p.category === category)
    .reduce<Record<string, number>>((acc, item) => {
      const key = reflectionKind[item.kind].toLowerCase();
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

  return conjoin(
    Object.entries(kinds)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([kind, count]) => plural(kind, count, true)),
  );
}

export async function createIndices(pages: Page[], packageName: string): Promise<void> {
  const index: string[] = [
    ...header,
    `[@technobuddha](./index.md)`,
    empty,
    `# ${capitalize(packageName)}`,
    empty,
  ];

  const groups = [...new Set(pages.map((p) => p.group)).values()].sort((a, b) =>
    a.localeCompare(b),
  );
  for (const group of groups) {
    const categories = [
      ...new Set(pages.filter((p) => p.group === group).map((p) => p.category)),
    ].sort((a, b) => a.localeCompare(b));

    index.push(
      `## [${group}](${packageName}/index_${camelCase(group)}.md)`,
      empty,
      '| Category | Contents |',
      '| --- | --- |',
      ...categories.map(
        (category) =>
          `| [${category}](${packageName}/index_${camelCase(group)}_${camelCase(category)}.md) | ${counts(group, category, pages)} |`,
      ),
      empty,
    );

    const groupIndex: string[] = [
      ...header,
      `[@technobuddha](../index.md) > [${packageName}](../${packageName}.md)`,
      empty,
      `# ${group}`,
    ];

    for (const category of [...categories].sort()) {
      const items = pages
        .filter(
          (p) =>
            // (p.kind === ReflectionKind.Function || p.kind === ReflectionKind.Class) &&
            p.group === group && p.category === category,
        )
        .sort((a, b) => a.name.localeCompare(b.name));

      groupIndex.push(
        empty,
        `## [${category}](index_${camelCase(group)}_${camelCase(category)}.md)`,
        empty,
        '<div class="tb-group">',
        ...items.map(
          (item) =>
            `<a data-kind="${initials(reflectionKind[item.kind])}" href="./${item.url.replace(`${packageName}/`, empty).replace('.md', '.html')}">${escapeHTML(item.name)}</a>`,
        ),
        '</div>',
      );
    }

    groupIndex.push(empty);

    await fs.writeFile(
      `./doc/${packageName}/index_${camelCase(group)}.md`,
      groupIndex.join('\n'),
      'utf8',
    );

    for (const category of categories) {
      const items = pages
        .filter((p) => p.group === group && p.category === category)
        .sort((a, b) => a.name.localeCompare(b.name));

      const categoryIndex: string[] = [
        ...header,
        `[@technobuddha](../index.md) > [${packageName}](../${packageName}.md) > [${group}](index_${camelCase(group)}.md)`,
        empty,
        `# ${category}`,
        empty,
        '| Name | Type | Description |',
        '| ---- | ---- |----------- |',
      ];

      for (const item of items) {
        categoryIndex.push(
          `| [${item.name}](./${item.url.replace(`${packageName}/`, empty)}) | ${reflectionKind[item.kind]} | ${item.summary.replaceAll(`${packageName}/`, empty)} |`,
        );
      }

      categoryIndex.push(empty);

      await fs.writeFile(
        `./doc/${packageName}/index_${camelCase(group)}_${camelCase(category)}.md`,
        categoryIndex.join('\n'),
        'utf8',
      );
    }
  }

  index.push(empty);

  await fs.writeFile(`./doc/${packageName}.md`, index.join('\n'), 'utf8');
}
