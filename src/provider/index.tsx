import React from 'react';

import counterStore from '../stores/Counter';
import fileSystem from '../stores/Fs';
import { Provider } from 'mobx-react';
import themeStore from '../stores/Theme';
import { loader } from '@monaco-editor/react';

// https://github.com/suren-atoyan/monaco-react/issues/324
// https://github.com/jsdelivr/jsdelivr/issues/18354
// 国内cdn访问异常修复 => 迁移所有editor资源至本地
loader.config({
  // 不支持相对路径访问
  paths: { vs: location.origin + '/lib' },
});
const stores = {
  counterStore,
  fileSystem,
  themeStore,
};

export default class ReduxWrapper extends React.PureComponent {
  render() {
    return <Provider {...stores}>{this.props.children}</Provider>;
  }
}
