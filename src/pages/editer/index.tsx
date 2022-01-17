import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.less'
import FileTree from './fileTree';
import NpmTree from './npmDep'
import Preview from './preview';
import FileHistory from './fileHistory';
import Editor from '@/components/editor';
type StateType = {
  inputVal: string;
};
@inject('counterStore')
@observer
class Editer extends React.Component<
  { counterStore: CounterStore },
  StateType
> {
  constructor(props: { counterStore: CounterStore }) {
    super(props);
    this.state = {
      inputVal: '',
    };
  }
  setVal(val: string) {
    this.setState({
      inputVal: val,
    });
  }
  render(): React.ReactNode {
    const store = this.props;
    const { counterStore } = store;
    // const [inputVal, setVal] = useState('')
    
    return (
      <div className={ styles['editer-wrap'] }>
        <div className={ styles['left-tree'] }>
          <p style={{ margin: '15px 0 0 15px' }}>资源管理器</p>
          <FileTree fileTree={[{title: '项目名', key: 'project-name', children: [ {title: 'index.vue', key: '2', isLeaf: true} ]}]}/>
          <NpmTree fileTree={[{title: '依赖管理', key: 'project-name', children: [ {title: 'lodash', key: '2', isLeaf: true} ]}]}/>
        </div>
        <div className={ styles["content-wrap"] }>
          <div className={ styles["code-edit-wrap"] }>
            <FileHistory panes={[{ title: 'index.vue', key: '/index.vue', content: <Editor  />, style: { height: '100%' } }]}/>
          </div>
          <div className={ styles["preview-wrap"] }> <Preview /> </div>
        </div>
      </div>
    );
  }
}

export default Editer;
