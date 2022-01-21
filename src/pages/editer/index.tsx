import React, { KeyboardEventHandler, useState } from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.less';
import FileTree from './fileTree';
import NpmTree from './npmDep';
import Preview from './preview';
import FileHistory from './fileHistory';
import Editor from '@/components/editor';
import { Button, Upload } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
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
    this.reloadFile = this.reloadFile.bind(this);
  }
  setVal(val: string) {
    this.setState({
      inputVal: val,
    });
  }
  reloadFile(e: any) {
    if (e.code === 'KeyS' && (e.altKey || e.ctrlKey || e.metaKey)) {
      this.props.fileSystem.reloadFile();
      e.preventDefault();
    }
  }
  render(): React.ReactNode {
    const store = this.props;
    const { fileSystem } = store;
    const { actives, files } = fileSystem as FileSys;
    return (
      <div className={styles['editer-wrap']}>
        <div className={styles['left-tree']}>
          <div className={styles['resource-header']}>
            资源管理器
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <Upload onChange={(e) => console.log(e)} fileList={[]}>
                <UploadOutlined />
              </Upload>{' '}
              <DownloadOutlined style={{ margin: '0 5px' }} />
            </div>
          </div>
          <FileTree fileSystem={fileSystem} />
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
          <div
            className={styles['code-edit-wrap']}
            onKeyDown={this.reloadFile}
            tabIndex={0}
          >
            {/* {actives.map((i) => ( */}
            <FileHistory
              panes={[...actives].map((i) => ({
                title: i.name,
                key: i.path,
                content: (
                  <Editor
                    file={i}
                    onChange={(i: FileDescription, val: string) => {
                      fileSystem.saveToLs(i.path, val);
                    }}
                  />
                ),
                style: { height: '100%' },
              }))}
            />
          </div>
          <div className={styles['preview-wrap']}>
            <Preview fileSystem={fileSystem} />
          </div>
        </div>
      </div>
    );
  }
}

export default Editer;
