import React from 'react';

import counterStore from '../stores/Counter';
import fileSystem from '../stores/Fs';
import { Provider } from 'mobx-react';
import themeStore from '../stores/Theme';
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
