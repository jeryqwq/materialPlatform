import { RenderProps } from 'types';
import React from 'react';
import ReactDOM from 'react-dom';
import load from 'react-browser-loader';
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
    parser: {},
    module: {},
  };
  const App = load(config);
  console.log(React, '----');
  ReactDOM.render(React.createElement(App.default, { a: 1 }), el?.shadowRoot);
}
