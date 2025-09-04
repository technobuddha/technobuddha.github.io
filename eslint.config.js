// @ts-check
// 🚨
// 🚨 CHANGES TO THIS FILE WILL BE OVERRIDDEN
// 🚨
import { app } from '@technobuddha/project';

// eslint-disable-next-line tsdoc/syntax
/** @type {import('eslint').Linter.Config[]} */
const config = [
  // .vitepress/tsconfig.json
  app.lint({
    files: ['.vitepress/**/*.ts'],
    ignores: [],
    environment: 'node',
    tsConfig: '.vitepress/tsconfig.json',
  }),
  // scripts/tsconfig.json
  app.lint({
    files: ['scripts/*.ts'],
    ignores: [],
    environment: 'node',
    tsConfig: 'scripts/tsconfig.json',
  }),
  // src/tsconfig.json
  app.lint({
    files: ['src/*.ts'],
    ignores: [],
    environment: 'node',
    tsConfig: 'src/tsconfig.json',
  }),
  // tsconfig.json
  app.lint({ files: ['*.config.js'], ignores: [], environment: 'node' }),
];

export default config;
