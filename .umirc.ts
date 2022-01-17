import { defineConfig } from 'umi';
import routes from './src/routes';
export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  plugins: [
  ],
  routes: routes,
  fastRefresh: {},
  mfsu: {}
});
