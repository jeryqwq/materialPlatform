import { fileIcons, getFileType } from '@/utils/file';
import { Tabs } from 'antd';
import { getFileInfo } from 'prettier';
import { TabPane, TabPaneProps } from 'rc-tabs';
import React, { useCallback } from 'react';
type TabPaneItem = TabPaneProps & {
  title: string;
  key: number | string;
  content: React.ReactNode;
};
function FileHistory(props: {
  panes: Array<TabPaneItem>;
  activeKey: string;
  onChange: (_: string) => void;
  onRemove: (_: string) => void;
}) {
  const { panes } = props;
  const handleOnEdit = useCallback((key, action: string) => {
    if (action === 'remove') {
      props.onRemove(key);
    }
  }, []);
  return (
    <div style={{ height: '100%' }}>
      <Tabs
        hideAdd
        onChange={props.onChange}
        activeKey={props.activeKey}
        tabBarGutter={0}
        type="editable-card"
        size="small"
        style={{ marginBottom: 0, height: '100%' }}
        onEdit={handleOnEdit}
      >
        {panes?.map((pane) => (
          <TabPane
            tab={
              <span>
                {fileIcons[getFileType(pane.key as string).type as 'png']}{' '}
                {pane.title}
              </span>
            }
            key={pane.key}
            style={{ height: '100%' }}
          >
            {pane.content}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
}

export default FileHistory;
