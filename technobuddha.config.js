//@ts-check
// eslint-disable-next-line tsdoc/syntax
/** @type {import("@technobuddha/project").TechnobuddhaConfig} */
const config = {
  git: {
	  ignore: ['doc', 'docs', '.vitepress/dist', '.vitepress/cache']
  }
};

export default config;
