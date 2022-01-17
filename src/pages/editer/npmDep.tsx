import { TreeDataNode, Tree } from 'antd';
import React, { useState } from 'react';
const { DirectoryTree } = Tree;
function FileTree(props: { fileTree: Array<TreeDataNode> }) {
  const [expandedKeys, setExpandedKey] = useState<Array<TreeDataNode['key']>>(['project-name'])
  const [fileTree, setFileData] = useState(props.fileTree)
  const onSelect = (selectedKeys: React.Key[], info: any) => {
    setExpandedKey(selectedKeys)
  };
  return (
    <div style={{ padding: '5px' }}>
        {/* <Search  placeholder="Search" onChange={() => {  }} /> */}
        <DirectoryTree
          showIcon={true}
          treeData={fileTree}
          onSelect={onSelect}
        />
    </div>
  );
}

export default FileTree;
