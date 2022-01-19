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
// fileTree={[
//   {
//     title: '项目名',
//     key: 'project-name',
//     children: [
//       { title: 'assets', key: '/assets', isLeaf: false,
//         children: [
//           { title: 'vue.png', key: '/src/vue.png', isLeaf: true }
//         ]
//       },
//       { title: 'src', key: '/src', isLeaf: false,
//         children: [
//           { title: 'main.js', key: '/src/main.js', isLeaf: true }
//         ]
//       },
//       { title: 'index.vue', key: '/index.vue', isLeaf: true },
//   ],
//   },
// ]}
type TreeFile = Array<TreeDataNode & { file: FileDescription }>;
function FileTree(props: { fileSystem: FileSys }) {
  const [expandedKeys, setExpandedKey] = useState<Array<TreeDataNode['key']>>([
    'project-name',
  ]);
  const [fileTree, setFileData] = useState([
    { title: 'Project-Name', key: '', children: [] },
  ]);
  const { files } = props.fileSystem;
  const onSelect = (selectedKeys: React.Key[], info: any) => {
    setExpandedKey(selectedKeys);
  };

  const addFile = useCallback(() => {}, []);
  // <FileAddOutlined /> <FolderAddOutlined /> <PictureOutlined />
  return (
    <div style={{ padding: '5px' }}>
      {/* <Search  placeholder="Search" onChange={() => {  }} /> */}
      <DirectoryTree
        showIcon={false}
        defaultExpandedKeys={['project-name']}
        treeData={fileTree}
        onSelect={onSelect}
        titleRender={(node) => {
          if (node.isLeaf) {
            return (
              <span className={styles['file-tree-node']}>
                <PictureOutlined />
                {node.title}
                <span className={styles['icon-wrap']}>
                  {' '}
                  <FormOutlined /> <DeleteOutlined />{' '}
                </span>
              </span>
            );
          } else {
            return (
              <span className={styles['file-tree-node']}>
                {node.title}{' '}
                <span className={styles['icon-wrap']}>
                  {' '}
                  <FileAddOutlined
                    onClick={addFile}
                  /> <FolderAddOutlined /> <FormOutlined /> <DeleteOutlined />{' '}
                </span>{' '}
              </span>
            );
          }
        }}
      />
    </div>
  );
}

export default FileTree;
