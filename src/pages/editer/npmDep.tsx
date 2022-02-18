import { searchPackage } from '@/server/npm';
import { Collapse, TreeSelect } from 'antd';
import React, { useEffect, useState } from 'react';
const { Panel } = Collapse;
const { TreeNode } = TreeSelect;

function FileTree(props: { dep: Dependencies }) {
  const [keyword, setKeyword] = useState('');

  const [searchLibTree, setSearchList] = useState<Array<any>>([]);

  useEffect(() => {
    (async function () {
      // const depList = await searchPackage(keyword)
      // console.log(depList, '---')
    })();
  }, [keyword]);
  const handleSearch = (val: string) => {
    setKeyword(val);
    console.log(val, '----change');
  };

  return (
    <div style={{ padding: '5px', borderTop: 'solid 1px #e3e8ee' }}>
      <Collapse ghost className="dep-collapse">
        <Panel header="Dependencies" key="1">
          <TreeSelect
            showSearch
            treeDataSimpleMode
            style={{ width: '100%' }}
            searchValue={keyword}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            onSearch={handleSearch}
          >
            <TreeNode value="parent 1" title="parent 1"></TreeNode>
          </TreeSelect>
          <p>lodash</p>
        </Panel>
      </Collapse>
    </div>
  );
}

export default FileTree;
