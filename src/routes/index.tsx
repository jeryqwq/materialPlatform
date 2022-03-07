import { CodeSandboxOutlined, SettingOutlined } from '@ant-design/icons';
import React from 'react';

export const editerPages = {
  path: '/',
  component: '@/layout/index',
  name: '操作',
  routes: [
    {
      path: '/editor',
      component: '@/pages/editor',
      name: '物料编辑器',
      icon: <CodeSandboxOutlined />,
    },
    {
      path: '/manage',
      component: '@/pages/setting',
      name: '设置',
      icon: <SettingOutlined />,
    },
  ],
};
const routes = [
  { path: '/index', component: '@/pages/index', name: '主页' },
  editerPages,
];
export default routes;
