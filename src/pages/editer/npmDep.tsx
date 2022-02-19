import { loadFileScript, searchPackage } from '@/server/npm';
import { Collapse, TreeSelect } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { observer } from 'mobx-react';
const { Panel } = Collapse;
const { TreeNode } = TreeSelect;

const searchDebounce = debounce(searchPackage, 1000);
function FileTree(props: { dep: Dependencies }) {
  const [keyword, setKeyword] = useState('');
  const [searchLibTree, setSearchList] = useState<Array<any>>([]);
  const { dep } = props;
  useEffect(() => {
    (async function () {
      if (keyword) {
        const depList = await searchDebounce(keyword);
        depList?.data?.results && setSearchList(depList.data.results);
      }
    })();
  }, [keyword]);
  const handleSearch = (val: string) => {
    setKeyword(val);
  };
  const handleLoadDep = useCallback(async (value: any, { node }: any) => {
    const { latest, name } = node;
    const { data: content } = await loadFileScript(latest);
    dep.addDep(value, {
      target: content,
      version: '',
      versionList: [],
      name,
    });
  }, []);
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
            onSelect={handleLoadDep}
          >
            {searchLibTree.map((i) => (
              <TreeNode value={i.name} title={i.name} node={i}></TreeNode>
            ))}
          </TreeSelect>
          {Object.keys(dep.dependencies).map((i) => (
            <p>{i}</p>
          ))}
        </Panel>
      </Collapse>
    </div>
  );
}

export default observer(FileTree);
