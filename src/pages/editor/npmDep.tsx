import { loadFileScript, searchPackage } from '@/server/npm';
import { Collapse, message, TreeSelect } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { observer } from 'mobx-react';
import styles from './index.less';
import { loadScript } from '@/utils/reload';
const { Panel } = Collapse;
const { TreeNode } = TreeSelect;
import sandbox from '@/sandbox/sandboxInstance';
const { renderSandbox } = sandbox;
const searchDebounce = debounce(async function (
  setCb: Function,
  keyword: string,
) {
  const deps = await searchPackage(keyword);
  deps?.data?.results && setCb(deps.data.results);
},
500);
function FileTree(props: { dep: Dependencies }) {
  const [keyword, setKeyword] = useState('');
  const [searchLibTree, setSearchList] = useState<Array<any>>([]);
  const { dep } = props;
  useEffect(() => {
    if (keyword) {
      searchDebounce(setSearchList, keyword);
    }
  }, [keyword]);
  const handleSearch = (val: string) => {
    setKeyword(val);
  };
  const handleLoadDep = useCallback(async (value: any, { node }: any) => {
    const { latest, name, version, filename } = node;
    if (dep.dependencies[value]) return;
    const { data: content } = await loadFileScript(latest);
    let lib = {
      target: content,
      version,
      versionList: [],
      name,
      globalName: '',
      url: latest,
    };
    loadScript(
      document.head,
      lib,
      (key, obj) => {
        if (key) {
          lib.globalName = key;
        } else {
          message.info('该依赖未提供umd格式代码');
        }
        dep.addDep(value, lib);
      },
      renderSandbox.proxy,
    );
  }, []);
  return (
    <div style={{ padding: '5px', borderTop: 'solid 1px #e3e8ee' }}>
      <Collapse ghost className="dep-collapse">
        <Panel header="Dependencies" key="1">
          <TreeSelect
            showSearch
            treeDataSimpleMode
            style={{ width: '100%', marginBottom: '10px' }}
            searchValue={keyword}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            onSearch={handleSearch}
            onSelect={handleLoadDep}
          >
            {searchLibTree.map((i) => (
              <TreeNode
                value={i.name}
                title={i.name}
                node={i}
                key={i.name}
              ></TreeNode>
            ))}
          </TreeSelect>
          {Object.keys(dep.dependencies).map((i) => (
            <div className={styles['version-item']} key={i}>
              {' '}
              <span>{i}</span> <span>{dep.dependencies[i].version}</span>{' '}
            </div>
          ))}
        </Panel>
      </Collapse>
    </div>
  );
}

export default observer(FileTree);
