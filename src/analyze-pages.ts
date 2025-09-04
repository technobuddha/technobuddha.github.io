/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable n/no-sync */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'node:fs';

import { splitLines } from '@technobuddha/library';
import { Comment, type ReflectionKind, type RouterTarget } from 'typedoc';
import { type MarkdownRendererEvent } from 'typedoc-plugin-markdown';

export type Page = {
  url: string;
  name: string;
  kind: ReflectionKind;
  model: RouterTarget;
  group: string;
  category: string;
  link: string;
  summary: string;
};

export function analyzePages(renderer: MarkdownRendererEvent, packageName: string): Page[] {
  const pages: Page[] = [];

  for (const page of renderer.pages) {
    const { url, model } = page;
    if (url.startsWith(`${packageName}/`)) {
      const { name, kind, comment, signatures } = model as any;

      const com: Comment | undefined = comment ?? signatures?.[0]?.comment;

      if (com) {
        // const summary = Comment.combineDisplayParts(com.getShortSummary(true));
        // const description = Comment.combineDisplayParts(com.summary);
        const tags = Object.fromEntries(
          com.blockTags
            .filter((c) => c.tag === '@group' || c.tag === '@category')
            .map((c) => [c.tag, Comment.combineDisplayParts(c.content)]),
        );

        const group = tags['@group'];
        const category = tags['@category'];

        if (group && category) {
          pages.push({ url, name, kind, model, group, category, link: '', summary: '' });
        } else {
          console.log('NO GROUP OR CATEGORY', { url, name, group, category });
        }
      } else {
        console.log('NO COMMENT', url, name);
      }
    }
  }

  const lines = splitLines(fs.readFileSync(`./doc/${packageName}.md`, 'utf8'));
  let group: string | null = null;
  let category: string | null = null;

  for (const line of lines) {
    if (line.startsWith('## ')) {
      group = line.slice(3).trim();
      category = null;
    } else if (line.startsWith('###')) {
      category = line.slice(4).trim();
    } else {
      const matches = /^\| \[(.*?)\]\((.*?)\) \| (.*?) \|$/u.exec(line);
      if (matches) {
        const [, name, link, summary] = matches;
        if (group && category) {
          const page = pages.find(
            (p) => p.group === group && p.category === category && p.name === name,
          );
          if (page) {
            page.link = link;
            page.summary = summary;
          }
        }
      }
    }
  }

  return pages;
}
