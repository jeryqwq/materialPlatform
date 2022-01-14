import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  plugins: [
    // './umi-plugin-entry.js',
  ],
  routes: [
    { path: '/index', component: '@/pages/index' },
    { path: '/', component: '@/layout/index',
      routes: [
        { path: '/editer', component: '@/pages/editer' },
        { path: '/manage', component: '@/pages/manage' }
      ]
    },
  ],
  fastRefresh: {},
  mfsu: {},
  // sass: {}
});
