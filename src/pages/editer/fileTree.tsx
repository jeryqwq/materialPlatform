import { TreeDataNode, Tree } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
const { DirectoryTree } = Tree;
import {
  FileAddOutlined,
  FolderAddOutlined,
  PictureOutlined,
  FormOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import styles from './index.less';
import { file2Tree } from '@/utils/file';
import { TreeFileItem } from 'types';
import { withInputWrap } from '@/utils';

function FileTree(props: { fileSystem: FileSys }) {
  const [expandedKeys, setExpandedKey] = useState<Array<TreeDataNode['key']>>([
    'project-name',
  ]);
  const { fileSystem } = props;
  const [fileTree, setFileData] = useState(
    file2Tree(fileSystem, 'project-name'),
  );
  const onSelect = (selectedKeys: React.Key[], info: any) => {
    setExpandedKey(selectedKeys);
  };
  const addFile = useCallback((node: TreeFileItem, fileName: string) => {
    fileSystem.saveToLs((node.key as string) + '/' + fileName, '');
    fileSystem.reloadFile();
  }, []);
  const addFolder = useCallback((node: TreeFileItem, folderName: string) => {
    // fileSystem.saveToLs(node.key as string + '/' + folderName + '/index', '')
    // setFileData()
    fileSystem.reloadFile();
  }, []);
  useEffect(() => {
    setFileData(file2Tree(fileSystem, 'project-name'));
  }, [fileSystem.files]);
  return (
    <div style={{ padding: '5px' }}>
      {/* <Search  placeholder="Search" onChange={() => {  }} /> */}
      <DirectoryTree
        showIcon={false}
        defaultExpandedKeys={['project-name']}
        treeData={fileTree}
        onSelect={onSelect}
        titleRender={(node: any) => {
          if (node.isLeaf) {
            return (
              <span
                className={styles['file-tree-node']}
                onClick={(e) => fileSystem.activeFile(node.file)}
              >
                {node.title}
                <span className={styles['icon-wrap']}>
                  <FormOutlined /> <DeleteOutlined />
                </span>
              </span>
            );
          } else {
            return (
              <span className={styles['file-tree-node']}>
                {node.title}
                <span className={styles['icon-wrap']}>
                  {withInputWrap({
                    children: <FileAddOutlined />,
                    title: '请输入文件名称',
                    cb: (val) => addFile(node, val),
                  })}
                  {withInputWrap({
                    children: <FolderAddOutlined />,
                    title: '请输入文件夹名称',
                    cb: (val) => addFolder(node, val),
                  })}
                  <FormOutlined /> <DeleteOutlined />
                </span>
              </span>
            );
          }
        }}
      />
    </div>
  );
}

export default FileTree;
