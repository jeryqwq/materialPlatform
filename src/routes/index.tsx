import { CodeSandboxOutlined, CrownOutlined } from '@ant-design/icons';
import React from 'react'

export const editerPages = { path: '/', component: '@/layout/index', name: '操作',
  routes: [
    { path: '/editer', component: '@/pages/editer', name: '编辑器', icon: <CodeSandboxOutlined /> },
    { path: '/manage', component: '@/pages/manage', name: '管理', icon: <CrownOutlined /> }
  ]
}
const routes = [
  { path: '/index', component: '@/pages/index', name: '主页' },
  editerPages
]
export default routes