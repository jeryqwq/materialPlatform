import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.less';
import FileTree from './fileTree';
import NpmTree from './npmDep';
import Preview from './preview';
import FileHistory from './fileHistory';
import Editor from '@/components/editor';
type StateType = {
  inputVal: string;
};
type StoreProps = {
  counterStore: CounterStore;
  fileSystem: FileSys;
};
@inject('counterStore', 'fileSystem')
@observer
class Editer extends React.Component<StoreProps, StateType> {
  constructor(props: StoreProps) {
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
    const { fileSystem } = store;
    const { actives } = fileSystem as FileSys;
    return (
      <div className={styles['editer-wrap']}>
        <div className={styles['left-tree']}>
          <p style={{ margin: '15px 0 0 15px' }}>资源管理器</p>
          <FileTree
            fileTree={[
              {
                title: '项目名',
                key: 'project-name',
                children: [{ title: 'index.vue', key: '2', isLeaf: true }],
              },
            ]}
          />
          <NpmTree
            fileTree={[
              {
                title: '依赖管理',
                key: 'project-name',
                children: [{ title: 'lodash', key: '2', isLeaf: true }],
              },
            ]}
          />
        </div>
        <div className={styles['content-wrap']}>
          <div className={styles['code-edit-wrap']}>
            {actives.map((i) => (
              <FileHistory
                key={i.path}
                panes={[
                  {
                    title: i.name,
                    key: i.path,
                    content: <Editor file={i} />,
                    style: { height: '100%' },
                  },
                ]}
              />
            ))}
          </div>
          <div className={styles['preview-wrap']}>
            {' '}
            <Preview fileSystem={fileSystem} />{' '}
          </div>
        </div>
      </div>
    );
  }
}

export default Editer;
