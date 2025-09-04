/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable check-file/folder-naming-convention */

// https://vitepress.dev/guide/custom-theme
import { type Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';

import './style.css';

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    }),
  enhanceApp({ app, router, siteData }) {
    // ...
  },
} satisfies Theme;
