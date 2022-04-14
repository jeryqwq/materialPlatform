import React from 'react';
import './../../node_modules/antd/dist/antd.variable.min.css';
import fileSystem from '../stores/Fs';
import { Provider } from 'mobx-react';
import themeStore from '../stores/Theme';
import { loader } from '@monaco-editor/react';
import dependenciesStore from '../stores/Dependencies';
// https://github.com/suren-atoyan/monaco-react/issues/324
// https://github.com/jsdelivr/jsdelivr/issues/18354
// 国内cdn访问异常修复 => 迁移所有editor资源至本地

loader.config({
  // 不支持相对路径访问
  paths: { vs: location.origin + '/vs' },
});
// loader.init().then(monaco =>{
//   monaco.languages.typescript.typescriptDefaults.setCompilerOptions({ // ts类型支持
//     target: monaco.languages.typescript.ScriptTarget.ES2016,
//     allowNonTsExtensions: true,
//     moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
//     module: monaco.languages.typescript.ModuleKind.CommonJS,
//     noEmit: true,
//     typeRoots: ["node_modules/@types"],
//     jsx: monaco.languages.typescript.JsxEmit.React,
//     jsxFactory: 'JSXAlone.createElement',
//   })
// });
const stores = {
  fileSystem,
  themeStore,
  dependenciesStore,
};

export default class ReduxWrapper extends React.PureComponent {
  render() {
    return <Provider {...stores}>{this.props.children}</Provider>;
  }
}
