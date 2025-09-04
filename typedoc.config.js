//@ts-check

/** @type {import('typedoc').TypeDocOptions & import('typedoc-plugin-markdown').PluginOptions} */
const config = {
  // typedoc
  //  Configuration
  name: '@technobuddha',
  plugin: [
    'typedoc-plugin-markdown',
    'typedoc-vitepress-theme',
    'typedoc-plugin-mdn-links',
    '@giancosta86/typedoc-readonly',
    'typedoc-plugin-coverage',
    './dist/typedoc-technobuddha-plugin.js',
  ],
  //  Input
  alwaysCreateEntryPointModule: true,
  entryPointStrategy: 'packages',
  entryPoints: [
    '../@technobuddha/library',
    '../@technobuddha/react-hooks',
    '../@technobuddha/builder',
    // '../@technobuddha/color',
    // '../@technobuddha/maze',
    // '../@technobuddha/datagrid',
    // '../@technobuddha/openapi',
    // '../@technobuddha/project',
    // '../@technobuddha/size',
    // '../eslint-plugin-technobuddha',
    // '../postcss-mui-theme',
    // '../css-module-type-definitions',
  ],
  exclude: [],
  excludeInternal: true,
  excludePrivate: true,
  excludeProtected: true,
  gitRevision: 'main',
  readme: 'none',
  //  Output
  out: 'doc',
  router: 'structure',
  basePath: '.',
  navigation: {
    includeCategories: true,
    includeGroups: true,
    includeFolders: false,
    compactFolders: true,
    excludeReferences: true,
  },
  //  Organization
  categorizeByGroup: true,
  defaultCategory: 'Uncategorized',
  categoryOrder: ['Uncategorized', '*'],

  // typedoc-plugin-markdown
  //  File Options
  entryFileName: 'index.md',
  flattenOutputFiles: true,
  mergeReadme: false,
  //  Display
  hideBreadcrumbs: false,
  hidePageHeader: true,
  hidePageTitle: false,
  expandObjects: true,
  expandParameters: true,
  indexFormat: 'table',
  parametersFormat: 'table',
  interfacePropertiesFormat: 'table',
  classPropertiesFormat: 'table',
  typeAliasPropertiesFormat: 'table',
  enumMembersFormat: 'table',
  propertyMembersFormat: 'table',
  typeDeclarationFormat: 'table',
  typeDeclarationVisibility: 'verbose',
  useCodeBlocks: true,
};

export default config;
