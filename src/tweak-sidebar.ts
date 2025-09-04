import fs from 'node:fs/promises';

import { camelCase } from '@technobuddha/library';
import { type DefaultTheme } from 'vitepress';

function fixLinks(bar: DefaultTheme.Sidebar): void {
  if (Array.isArray(bar)) {
    for (const item of bar) {
      if (item.link?.startsWith('/doc')) {
        item.link = item.link.replace('/doc', '');
      }
      if (item.items) {
        fixLinks(item.items);
      }
    }
  }
}

export async function tweakSidebar(packageName: string): Promise<void> {
  const sidebar: DefaultTheme.SidebarItem[] = JSON.parse(
    await fs.readFile('doc/typedoc-sidebar.json', 'utf8'),
  );

  for (const sb of sidebar) {
    if (sb.text === packageName) {
      if (sb.items) {
        for (const sbGroup of sb.items) {
          if (sbGroup.text) {
            if (!('link' in sbGroup)) {
              sbGroup.link = `/doc/${packageName}/index_${camelCase(sbGroup.text)}.md`;
            }

            if (sbGroup.items) {
              for (const sbCategory of sbGroup.items) {
                if (sbCategory.text) {
                  if (!('link' in sbCategory)) {
                    sbCategory.link = `/doc/${packageName}/index_${camelCase(sbGroup.text)}_${camelCase(sbCategory.text)}.md`;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  fixLinks(sidebar);

  await fs.writeFile('doc/typedoc-sidebar.json', JSON.stringify(sidebar), 'utf8');
}
