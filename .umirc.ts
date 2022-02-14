import { defineConfig } from 'umi';
import routes from './src/routes';
export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  plugins: [],
  routes: routes,
  fastRefresh: {},
  // headScripts: ['https://cdn.jsdelivr.net/npm/darkreader@latest/darkreader.min.js'],
  mfsu: {},

  proxy: {
    '/ssa': {
      target: 'http://10.28.185.173:8089',
      changeOrigin: true,
    },
  },
});
