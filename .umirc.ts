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
      target: 'http://10.28.184.32:8089',
      changeOrigin: true,
    },
    '/static/material': {
      target: 'http://10.28.184.234:8686',
      changeOrigin: true,
    },
  },
  locale: {
    default: 'zh-CN',
  },
});
