import React from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.less';
import FileTree from './fileTree';
import NpmTree from './npmDep';
import Preview from './previewTool';
import FileHistory from './fileHistory';
import { Alert, Upload, Empty } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { loadZipFile, resolveZipFile } from '@/utils/zip';
import { CACHE_COMP_LOADED } from '@/contants/render';
import DragResize from '@/components/DragBorderResize';
import { DRAG_DIRECTION } from '@/contants';
import { getFileType, renderFilePath } from '@/utils/file';
import { ReactPropsWithRouter } from 'types';
import ProjectConfig from './projectConfig';
import { loadScript } from '@/utils/reload';
type StateType = {
  inputVal: string;
};
type StoreProps = {
  fileSystem: FileSys;
  themeStore: ThemeStore;
  dependenciesStore: Dependencies;
} & ReactPropsWithRouter;

@inject('fileSystem', 'themeStore', 'dependenciesStore')
@observer
class Editor extends React.Component<StoreProps, StateType> {
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
      this.props.fileSystem.debounceReload();
      e.preventDefault();
    }
  }
  uplaodZipFile = (e: any) => {
    const {
      file: { originFileObj },
    } = e;
    let { webkitRelativePath, name } = originFileObj;
    let temp = webkitRelativePath.split('/');
    temp.shift();
    webkitRelativePath = '/' + temp.join('/');
    if (webkitRelativePath.startsWith('/lib/')) {
      // debugger
      // const libName = getFileType(webkitRelativePath).name;
      //     const lib = depVersion.dependencies[libName];
      //     this.props.dependenciesStore.addDep(libName, {
      //       ...lib,
      //       target: context,
      //     });
      //     loadScript(document.head, { ...lib, target: context });
      // return;
    } // 忽略lib处理
    this.props.fileSystem.saveToLs(webkitRelativePath, originFileObj);
  };
  render() {
    const store = this.props;
    const { location, history } = this.props;
    const { fileSystem, themeStore, dependenciesStore } = store;
    const { actives, files } = fileSystem as FileSys; // 注： 这个files必须要拿到一次，做依赖收集
    const { type } = location.query as { type: string | [] };

    return (
      <div className={styles['editer-wrap']}>
        <div className={styles['left-tree']}>
          <DragResize
            style={{
              width: 200,
              height: '100%',
              overflow: 'scroll',
            }}
            direction={DRAG_DIRECTION.RIGHT_LEFT}
            min={0}
            max={Infinity}
          >
            {type === 'manage' ||
            (type && type[type.length - 1] === 'manage') ? (
              <ProjectConfig />
            ) : (
              <>
                <div className={styles['resource-header']}>
                  资源管理器
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Upload
                      onChange={this.uplaodZipFile}
                      fileList={[]}
                      directory
                    >
                      <UploadOutlined
                        onClick={() => {
                          this.props.fileSystem.resetFile();
                        }}
                      />
                    </Upload>
                    <DownloadOutlined
                      style={{ margin: '0 5px' }}
                      onClick={() =>
                        resolveZipFile(fileSystem.files, 'files.zip')
                      }
                    />
                  </div>
                </div>
                <FileTree fileSystem={fileSystem} />
                <NpmTree dep={dependenciesStore} />
              </>
            )}
          </DragResize>
        </div>
        <div className={styles['content-wrap']}>
          <div
            className={styles['code-edit-wrap']}
            onKeyDown={this.reloadFile}
            tabIndex={0}
          >
            {fileSystem.activeKey.length ? (
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
                  const Editor =
                    CACHE_COMP_LOADED[i.type] ||
                    function () {
                      return (
                        <Alert
                          message="提示"
                          type="info"
                          closeText="目前暂不支持此类文件的预览， 请联系相关开发人员"
                          style={{ marginTop: '50px' }}
                        />
                      );
                    };
                  return {
                    title: i.name,
                    key: i.path,
                    content: (
                      <div style={{ height: 'calc( 100vh - 85px )' }}>
                        <div className={styles['path-wrap']}>
                          {renderFilePath(i.path)}
                        </div>
                        <Editor
                          file={i}
                          onChange={(i: FileDescription, val: string) => {
                            fileSystem.updateFile(i.path, val);
                          }}
                          theme={themeStore.themeConfig.navTheme}
                        />
                      </div>
                    ),
                    style: { height: '100%' },
                  };
                })}
              />
            ) : (
              <Empty
                description="暂无预览的文件，请在左侧文件区打开预览或者编辑"
                imageStyle={{ marginTop: 40 }}
              />
            )}
          </div>
          <div className={styles['preview-wrap']}>
            <DragResize
              style={{
                height: '100%',
                width: 400,
              }}
              direction={DRAG_DIRECTION.LEFT_RIGHT}
              min={0}
              max={Infinity}
              domId={'RIGHT_PREVIEW'}
            >
              <Preview fileSystem={fileSystem} />
            </DragResize>
          </div>
        </div>
      </div>
    );
  }
}

export default Editor;
