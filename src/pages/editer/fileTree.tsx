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
import { copyPath, genUid, updateTreeData, withInputWrap } from '@/utils';
import {
  CONTEXT_MENU_FILE,
  CONTEXT_MENU_FOLDER,
  MENU_FILE,
  MENU_FOLDER,
  MENU_KEYS,
} from '@/contants/MENU_TYPE';
import { ContextMenuTrigger } from 'react-contextmenu';
import {
  INIT_PROJECT_NAME,
  _FILE_TEMP_MARK_NAME,
  _FOLDER_TEMP_MARK_NAME,
} from '@/contants';

function FileTree(props: { fileSystem: FileSys }) {
  const [expandedKeys, setExpandedKey] = useState<Array<TreeDataNode['key']>>([
    INIT_PROJECT_NAME,
  ]);
  const { fileSystem } = props;
  const [fileTree, setFileData] = useState(
    file2Tree(fileSystem, INIT_PROJECT_NAME),
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
      isEditName: true,
      file: {
        path: key,
        url: '',
        target: '',
        type: fileInfo.type as FileTypes,
        compiled: true,
        result: '',
        name: fileInfo.name,
        id: genUid(),
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
      isEditName: true,
    };
    node?.children?.push(folderItem);
    setFileData((origin) => new Array(...origin));
  }, []);
  useEffect(() => {
    setFileData(file2Tree(fileSystem, INIT_PROJECT_NAME));
  }, [fileSystem.files]);
  const updateFolderName = (
    node: TreeFileItem,
    name: string,
    isEdit?: boolean,
  ) => {
    node.title = name;
    node.isEditName = isEdit;
    const splitArr = (node.key as string).split('/');
    splitArr.pop();
    node.key = splitArr.join('/') + '/' + name;
    setFileData(new Array(...fileTree));
  };
  const updateFileName = (
    node: TreeFileItem,
    name: string,
    isEdit?: boolean,
  ) => {
    const { file } = node;
    node.title = name;
    node.key = (node.key as string).replace(INIT_PROJECT_NAME, '');
    node.isEditName = isEdit;
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
    const key = (node.key as string).replace(INIT_PROJECT_NAME, '');
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
      case MENU_KEYS.ADD_FILE:
        addFile(node, '');
        break;
      case MENU_KEYS.ADD_FOLDER:
        addFolder(node, '');
        break;
      case MENU_KEYS.RENAME:
        // node.isLeaf ?   file || folder
        node.isLeaf
          ? updateFileName(node, node.title as string, true)
          : updateFolderName(node, node.title as string, true);
      case MENU_KEYS.COPY_CONTENT:
        node && copyPath(node.key as string);
      case MENU_KEYS.COPY_CONTENT:
        node && copyPath(node.key as string);
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
        defaultExpandedKeys={[INIT_PROJECT_NAME]}
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
                  {node.isEditName ? (
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
                  {node.isEditName ? (
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
                        addFile(node, '');
                        e.stopPropagation();
                      }}
                    />
                    <FolderAddOutlined
                      style={{ margin: '0 5px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        addFolder(node, '');
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
