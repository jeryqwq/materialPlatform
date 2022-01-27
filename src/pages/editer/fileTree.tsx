import { TreeDataNode, Tree, Cascader, Input, Button, Upload } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import ContextMenu from '@/components/contentMenu/index';
const { DirectoryTree } = Tree;
import {
  FileAddOutlined,
  FolderAddOutlined,
  PictureOutlined,
  FormOutlined,
  DeleteOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import styles from './index.less';
import {
  file2Tree,
  fileIcons,
  findFileItemByFileTree,
  getFileType,
} from '@/utils/file';
import { ContextMenuItem, TreeFileItem } from 'types';
import { updateTreeData, withInputWrap } from '@/utils';
import {
  CONTEXT_MENU_FILE,
  CONTEXT_MENU_FOLDER,
  MENU_FILE,
  MENU_FOLDER,
} from '@/contants/MENU_TYPE';
import { ContextMenuTrigger } from 'react-contextmenu';

function FileTree(props: { fileSystem: FileSys }) {
  const [expandedKeys, setExpandedKey] = useState<Array<TreeDataNode['key']>>([
    'project-name',
  ]);
  const { fileSystem } = props;
  const [fileTree, setFileData] = useState(
    file2Tree(fileSystem, 'project-name'),
  );
  const onExpand = (selectedKeys: React.Key[], info: any) => {
    setExpandedKey(selectedKeys);
  };
  const addFile = useCallback((node: TreeFileItem, fileName: string) => {
    !expandedKeys.includes(node.key) &&
      setExpandedKey(expandedKeys.concat(node.key));
    const key = (node.key as string) + '/' + fileName;
    const fileInfo = getFileType(key);
    const curFileNode: TreeFileItem = {
      isLeaf: true,
      title: fileName,
      key: key,
      children: [],
      file: {
        path: key,
        url: '',
        target: '',
        type: fileInfo.type as FileTypes,
        compiled: true,
        result: '',
        name: fileInfo.name,
      },
    };
    curFileNode.switcherIcon =
      fileIcons[(fileInfo.type as FileTypes) || 'common'];
    node?.children?.push(curFileNode);
    setFileData((origin) => new Array(...origin));
  }, []);
  const addFolder = useCallback((node: TreeFileItem, folderName: string) => {
    !expandedKeys.includes(node.key) &&
      setExpandedKey(expandedKeys.concat(node.key));
    const folderItem = {
      isLeaf: false,
      title: folderName,
      key: node.key + '/' + folderName,
      children: [],
    };
    node?.children?.push(folderItem);
    setFileData((origin) => new Array(...origin));
  }, []);
  useEffect(() => {
    setFileData(file2Tree(fileSystem, 'project-name'));
  }, [fileSystem.files]);
  const updateFolderName = (node: TreeFileItem, name: string) => {
    node.title = name;
    const splitArr = (node.key as string).split('/');
    splitArr.pop();
    node.key = splitArr.join('/') + '/' + name;
    setFileData(new Array(...fileTree));
  };
  const updateFileName = (node: TreeFileItem, name: string) => {
    const { file } = node;
    node.title = name;
    node.key = (node.key as string).replace('project-name', '');
    const splitArr = (node.key as string).split('/');
    splitArr.pop();
    node.key = splitArr.join('/') + '/' + name;
    const fileInfo = getFileType(node.key);
    if (file) {
      file.type = fileInfo.type as FileTypes;
      file.name = fileInfo.name;
      file.path = node.key;
      node.switcherIcon = fileIcons[file.type || 'common'];
    }
    fileSystem.saveToLs(node.key, file?.target || '');
    setFileData(new Array(...fileTree));
  };
  const uploadFile = useCallback((file: File, node: TreeFileItem) => {
    const { name } = file;
    const key = (node.key as string).replace('project-name', '');
    fileSystem.saveToLs(key + '/' + name, file);
    fileSystem.reloadFile();
  }, []);
  const contextMenuHandle = (
    e: MouseEvent,
    item: ContextMenuItem & { target: HTMLElement },
  ) => {
    const { value, target } = item;
    const nodeKye =
      (target.parentNode as HTMLElement).getAttribute('accessKey') || '';
    const node = findFileItemByFileTree(nodeKye, fileTree);
    if (!node) return;
    console.log(value, node);
    switch (value) {
      case 'addFile':
        addFile(node, 'TEMP_FILE_NAME');
        break;
      case 'addFolder':
        addFolder(node, 'TEMP_FOLDER_NAME');
        break;
      default:
        break;
    }
  };
  return (
    <div style={{ padding: '5px' }}>
      {/* <Search  placeholder="Search" onChange={() => {  }} /> */}
      <ContextMenu
        id={MENU_FOLDER}
        contextMenu={CONTEXT_MENU_FOLDER}
        handle={contextMenuHandle}
      />
      <ContextMenu
        id={MENU_FILE}
        contextMenu={CONTEXT_MENU_FILE}
        handle={contextMenuHandle}
      />
      <DirectoryTree
        showIcon={false}
        blockNode={true}
        autoExpandParent={true}
        expandedKeys={expandedKeys}
        defaultExpandedKeys={['project-name']}
        treeData={fileTree}
        onExpand={onExpand}
        titleRender={(node: any) => {
          if (node.isLeaf) {
            // 文件
            return (
              <ContextMenuTrigger
                id={MENU_FILE}
                attributes={{ accessKey: node.key }}
              >
                <span
                  className={styles['file-tree-node']}
                  onClick={(e) => fileSystem.activeFile(node.file)}
                >
                  {node.title === 'TEMP_FILE_NAME' ? (
                    <Input
                      size="small"
                      ref={(e) => e?.focus()}
                      onPressEnter={(e) =>
                        updateFileName(
                          node,
                          (e.target as HTMLInputElement).value,
                        )
                      }
                    ></Input>
                  ) : (
                    node.title
                  )}
                  <span className={styles['icon-wrap']}>
                    <FormOutlined /> <DeleteOutlined />
                  </span>
                </span>
              </ContextMenuTrigger>
            );
          } else {
            // 文件夹  folder
            return (
              // <Cascader options={CONTEXT_MENU} >
              <ContextMenuTrigger
                id={MENU_FOLDER}
                attributes={{ accessKey: node.key }}
              >
                <span className={styles['file-tree-node']}>
                  {node.title === 'TEMP_FOLDER_NAME' ? (
                    <Input
                      ref={(e) => e?.focus()}
                      size="small"
                      onPressEnter={(e) =>
                        updateFolderName(
                          node,
                          (e.target as HTMLInputElement).value,
                        )
                      }
                    ></Input>
                  ) : (
                    node.title
                  )}
                  <span className={styles['icon-wrap']}>
                    <FileAddOutlined
                      onClick={(e) => {
                        addFile(node, 'TEMP_FILE_NAME');
                        e.stopPropagation();
                      }}
                    />
                    <FolderAddOutlined
                      style={{ margin: '0 5px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        addFolder(node, 'TEMP_FOLDER_NAME');
                      }}
                    />
                    <Upload
                      onChange={(e) => {
                        uploadFile((e.file as any).originFileObj as File, node);
                      }}
                      fileList={[]}
                    >
                      <UploadOutlined />
                    </Upload>
                  </span>
                </span>
              </ContextMenuTrigger>
              // </Cascader>
            );
          }
        }}
      />
    </div>
  );
}

export default FileTree;
