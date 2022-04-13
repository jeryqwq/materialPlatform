import { RenderProps } from 'types';
import React from 'react';
import ReactDOM from 'react-dom';
import load from 'react-browser-loader';
import { isResource } from '@/utils/file';
import { addStyles, cssUrlHandler } from '@/utils/reload';
const stylus = window['stylus'] || {};

export default function (arg: {
  files: Record<string, string>;
  entry: string;
  props: RenderProps;
  el: HTMLElement;
}) {
  const sass = new window.Sass();
  const { files, entry, props, el } = arg;
  const config = {
    entry,
    el,
    files,
    React,
    ReactDOM,
    addStyle() {},
    parser: {
      moduleParser(path: string, config: any) {
        if (isResource(path)) {
          return config.files[path];
        }
      },
    },
    module: {
      scss: (path: string, source: string) => {
        return new Promise((reslove, reject) => {
          sass.compile(source, function (result: any) {
            if (result.text) {
              const replaceUrl = cssUrlHandler(
                result.text,
                props.fileSystem.files,
              );
              addStyles(replaceUrl, path, { shadowEl: el?.shadowRoot, path });
            }
          });
        });
      },
      stylus: (path: string, source: string) => {
        console.log(stylus(source), '---');
      },
    },
  };
  const App = load(config);
  ReactDOM.render(React.createElement(App.default, { a: 1 }), el?.shadowRoot);
}
