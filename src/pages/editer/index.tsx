import React, { KeyboardEventHandler, Suspense, useState } from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.less';
import FileTree from './fileTree';
import NpmTree from './npmDep';
import Preview from './previewTool';
import FileHistory from './fileHistory';
import { Alert, Button, Spin, Upload } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import VuePreview from '@/components/previews/vue';
import TsPreview from '@/components/previews/ts';
import StylusPreview from '@/components/previews/stylus';
import JsPreview from '@/components/previews/js';
import ScssPreview from '@/components/previews/scss';
import ImgPreview from '@/components/previews/img';
import CssPreview from '@/components/previews/css';
import PdfPreview from '@/components/previews/pdf';
import Mp4Preview from '@/components/previews/mp4';

type StateType = {
  inputVal: string;
};
type StoreProps = {
  counterStore: CounterStore;
  fileSystem: FileSys;
};
let cacheLoadComp: Record<
  string,
  (props: { file: FileDescription; onChange: Function }) => JSX.Element
> = {
  vue: VuePreview,
  ts: TsPreview,
  stylus: StylusPreview,
  js: JsPreview,
  scss: ScssPreview,
  img: ImgPreview,
  css: CssPreview,
  pdf: PdfPreview,
  mp4: Mp4Preview,
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
              </Upload>
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
            <FileHistory
              activeKey={fileSystem.activeKey}
              onChange={(val: string) =>
                fileSystem.activeFile(
                  [...fileSystem.actives].find(
                    (i) => i.path === val,
                  ) as FileDescription,
                )
              }
              panes={[...actives].map((i) => {
                const Editor = cacheLoadComp[i.type] || (
                  <Alert
                    message="提示"
                    type="info"
                    closeText="目前暂不支持此类文件的预览， 请联系相关开发人员"
                  />
                );
                return {
                  title: i.name,
                  key: i.path,
                  content: (
                    <div>
                      <div style={{ paddingLeft: '10px' }}>
                        {(cacheLoadComp[i.type] = Editor)}
                        {i.path.split('/').join(' > ')}
                      </div>
                      <Editor
                        file={i}
                        onChange={(i: FileDescription, val: string) => {
                          fileSystem.saveToLs(i.path, val);
                        }}
                      />
                    </div>
                  ),
                  style: { height: '100%' },
                };
              })}
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
