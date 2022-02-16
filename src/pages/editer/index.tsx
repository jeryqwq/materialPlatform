import React, { KeyboardEventHandler, Suspense, useState } from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.less';
import FileTree from './fileTree';
import NpmTree from './npmDep';
import Preview from './previewTool';
import FileHistory from './fileHistory';
import { Alert, Button, Spin, Upload } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import VuePreview from '@/components/FilePreviews/vue';
import TsPreview from '@/components/FilePreviews/ts';
import StylusPreview from '@/components/FilePreviews/stylus';
import JsPreview from '@/components/FilePreviews/js';
import ScssPreview from '@/components/FilePreviews/scss';
import ImgPreview from '@/components/FilePreviews/img';
import CssPreview from '@/components/FilePreviews/css';
import PdfPreview from '@/components/FilePreviews/pdf';
import Mp4Preview from '@/components/FilePreviews/mp4';
import { resolveZipFile } from '@/utils/zip';
import { INIT_PROJECT_KEY } from '@/contants';

type StateType = {
  inputVal: string;
};
type StoreProps = {
  counterStore: CounterStore;
  fileSystem: FileSys;
  themeStore: ThemeStore;
};
let cacheLoadComp: Record<
  string,
  (props: {
    file: FileDescription;
    onChange: Function;
    theme: 'light' | 'dark' | 'realdark';
  }) => JSX.Element
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
@inject('fileSystem', 'themeStore')
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
  render() {
    const store = this.props;
    const { fileSystem, themeStore } = store;
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
              <DownloadOutlined
                style={{ margin: '0 5px' }}
                onClick={() => resolveZipFile(fileSystem.files, 'test.zip')}
              />
            </div>
          </div>
          <FileTree fileSystem={fileSystem} />
          <NpmTree
            fileTree={[
              {
                title: '依赖管理',
                key: INIT_PROJECT_KEY,
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
              onChange={(val: string) => {
                const curFile = [...fileSystem.actives].find(
                  (i) => i.path === val,
                ) as FileDescription;
                fileSystem.activeFile(curFile);
              }}
              onRemove={(key: string) => {
                fileSystem.files[key] &&
                  fileSystem.removeActiveItem(fileSystem.files[key]);
                [...fileSystem.actives].length &&
                  fileSystem.activeFile([...fileSystem.actives][0]);
              }}
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
                    <div style={{ height: 'calc( 100vh - 85px )' }}>
                      <div style={{ paddingLeft: '10px' }}>
                        {i.path.split('/').join(' > ')}
                      </div>
                      <Editor
                        file={i}
                        onChange={(i: FileDescription, val: string) => {
                          fileSystem.saveToLs(i.path, val);
                        }}
                        theme={themeStore.themeConfig.navTheme}
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
