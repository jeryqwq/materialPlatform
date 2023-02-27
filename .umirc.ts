import { defineConfig } from 'umi';
import routes from './src/routes';
const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  plugins: [],
  routes: routes,
  fastRefresh: {},
  // headScripts: ['https://cdn.jsdelivr.net/npm/darkreader@latest/darkreader.min.js'],
  mfsu: {},
  dva: {
    immer: true,
    hmr: false,
    lazyLoad: true,
    disableModelsReExport: true,
  },
  dynamicImportSyntax: {},
  proxy: {
    '/vis': {
      target: 'http://10.28.184.222:8981/',
      changeOrigin: true,
    },
    '/static/material': {
      target: 'http://10.28.184.222:8981/',
      changeOrigin: true,
    },
  },
  extraBabelPlugins: [isProd ? 'transform-remove-console' : ''],
  chainWebpack(memo, { env, webpack, createCSSRule }) {
    // 设置 alias
    if (env === 'production') {
    }
    // memo.plugins.set('monaco',new MonacoWebpackPlugin())
    // memo.plugins.delete('prefetch')
  },
  locale: {
    default: 'zh-CN',
  },
  esbuild: {},
  ignoreMomentLocale: true,
});
