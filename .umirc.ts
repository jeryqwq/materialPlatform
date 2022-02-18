import { defineConfig } from 'umi';
import routes from './src/routes';
const themePath = [
  {
    from: 'src/components/',
  },
];
export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  plugins: [],
  routes: routes,
  fastRefresh: {},
  // headScripts: ['https://cdn.jsdelivr.net/npm/darkreader@latest/darkreader.min.js'],
  mfsu: {},
  theme: {
    '@s-site-menu-width': '258px',
    '@root-entry-name': 'variable',
  },
  proxy: {
    '/ssa': {
      target: 'http://10.28.185.173:8089',
      changeOrigin: true,
    },
  },
  locale: {
    default: 'zh-CN',
  },
});
