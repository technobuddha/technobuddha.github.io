/* eslint-disable check-file/folder-naming-convention */
import { type DefaultTheme, defineConfig } from 'vitepress';

import typedocSidebar from '../doc/typedoc-sidebar.json' with { type: 'json' };

const sidebar: DefaultTheme.Sidebar = typedocSidebar;

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '@technobuddha',
  srcDir: './doc',

  themeConfig: {
    logo: '/logo.svg',
    docFooter: {
      prev: false,
      next: false,
    },
    search: {
      provider: 'local',
    },

    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: 'Home', link: '/' }],

    sidebar,

    socialLinks: [{ icon: 'github', link: 'https://github.com/technobuddha/library' }],
  },
});
