import { TreeDataNode, Tree, Input, Upload, Modal } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ContextMenu from '@/components/ContentMenu/index';
const { DirectoryTree, TreeNode } = Tree;
import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import styles from './index.less';
import {
  file2Tree,
  fileIcons,
  findFileItemByFileTree,
  getFileType,
  renderSearchKeywordNode,
  searchTitleByKeyword,
} from '@/utils/file';
import { ContextMenuItem, TreeFile, TreeFileItem } from 'types';
import { copyPath, genUid } from '@/utils';
import {
  CONTEXT_MENU_FILE,
  CONTEXT_MENU_FOLDER,
  MENU_FILE,
  MENU_FOLDER,
  MENU_KEYS,
} from '@/contants/menuTypes';
import { ContextMenuTrigger } from 'react-contextmenu';
import {
  INIT_PROJECT_KEY,
  INIT_PROJECT_NAME,
  _FILE_TEMP_MARK_NAME,
  _FOLDER_TEMP_MARK_NAME,
} from '@/contants';

function FileTree(props: { fileSystem: FileSys }) {
  let curNode = useRef<TreeFileItem>();
  let keyword = useRef<string>('');
  const [expandedKeys, setExpandedKey] = useState<Array<TreeDataNode['key']>>([
    INIT_PROJECT_KEY,
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
    const key =
      node.key === INIT_PROJECT_KEY
        ? ''
        : (node.key as string) + '/' + fileName;
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
      key: node.key === INIT_PROJECT_KEY ? '' : node.key + '/' + folderName,
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
    const beforeKey = node.key as string;
    node.key = splitArr.join('/') + '/' + name;
    function deppReplaceFile(_node: TreeFileItem) {
      if (_node.children) {
        _node.children.forEach((i) => {
          const file = (i as TreeFileItem).file as any;
          if (file) {
            file.path = file.path.replace(beforeKey, node.key as string);
            i.key = file.path;
          }
          i.children && deppReplaceFile(i as TreeFileItem);
        });
      }
    }
    deppReplaceFile(node);
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
  const uploadFile = useCallback((file: File, node?: TreeFileItem) => {
    node = node || curNode.current;
    if (!node) return;
    const { name } = file;
    const key = (node.key as string).replace(INIT_PROJECT_NAME, '');
    fileSystem.saveToLs(key + '/' + name, file);
    fileSystem.reloadFile();
  }, []);
  const removeFileNode = useCallback((node: TreeFileItem) => {
    const isFile = node.isLeaf;
    Modal.confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: `删除文件${
        !isFile ? '夹' : ''
      }会导致有引用的代码执行发生意外的错误${
        !isFile ? '并删除该文件夹下的所有子文件和文件夹' : ''
      }，是否继续？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        if (isFile) {
          fileSystem.removeFile(node.key as string);
        } else {
          fileSystem.removeFolder(node.key + '/');
        }
        fileSystem.reloadFile();
      },
    });
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
        break;
      case MENU_KEYS.COPY_PATH:
        node && copyPath(node.key as string);
        break;
      case MENU_KEYS.COPY_CONTENT:
        node && copyPath(node.file?.target as string);
        break;
      case MENU_KEYS.UPLODAD:
        node && (curNode.current = node);
        break;
      case MENU_KEYS.DELETE:
        node && removeFileNode(node);
        break;
      default:
        break;
    }
  };
  const handleSearch = (e: any) => {
    const { value } = e.target;
    keyword.current = value;
    setExpandedKey(searchTitleByKeyword(value, fileTree));
  };
  return (
    <div style={{ padding: '5px' }}>
      <Input
        placeholder="请输入关键词"
        style={{ margin: '10px', width: 'calc( 100% - 20px )' }}
        suffix={<SearchOutlined />}
        onChange={handleSearch}
      />
      <ContextMenu
        id={MENU_FOLDER}
        contextMenu={CONTEXT_MENU_FOLDER}
        handle={contextMenuHandle}
        uploadFile={uploadFile}
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
                      defaultValue={node.title}
                      onPressEnter={(e) =>
                        updateFileName(
                          node,
                          (e.target as HTMLInputElement).value,
                        )
                      }
                    ></Input>
                  ) : keyword.current ? (
                    renderSearchKeywordNode(keyword.current, node.title)
                  ) : (
                    node.title
                  )}
                </span>
              </ContextMenuTrigger>
            );
          } else {
            // 文件夹  folder
            return (
              <ContextMenuTrigger
                id={MENU_FOLDER}
                attributes={{ accessKey: node.key }}
              >
                <span className={styles['file-tree-node']}>
                  {node.isEditName ? (
                    <Input
                      ref={(e) => e?.focus()}
                      size="small"
                      defaultValue={node.title}
                      onPressEnter={(e) =>
                        updateFolderName(
                          node,
                          (e.target as HTMLInputElement).value,
                        )
                      }
                    ></Input>
                  ) : keyword.current ? (
                    renderSearchKeywordNode(keyword.current, node.title)
                  ) : (
                    node.title
                  )}
                </span>
              </ContextMenuTrigger>
            );
          }
        }}
      />
    </div>
  );
}

export default FileTree;
