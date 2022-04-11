import { fileIcons, getFileType } from '@/utils/file';
import { Button, Tabs } from 'antd';
import { TabPane, TabPaneProps } from 'rc-tabs';
import React, { useCallback } from 'react';
import { PicLeftOutlined, FileOutlined } from '@ant-design/icons';
type TabPaneItem = TabPaneProps & {
  title: string;
  key: number | string;
  content: React.ReactNode;
};
function hidePreview() {
  const el = document.getElementById('RIGHT_PREVIEW');
  if (el && el.style.width === '5px') {
    el.style.width = '400px';
  } else {
    el && (el.style.width = '5px');
  }
}
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
    <div style={{ height: '100%', background: '#fafbfd' }}>
      <Tabs
        hideAdd
        onChange={props.onChange}
        activeKey={props.activeKey}
        tabBarGutter={0}
        type="editable-card"
        size="small"
        style={{ marginBottom: 0, height: '100%' }}
        onEdit={handleOnEdit}
        tabBarExtraContent={
          <PicLeftOutlined
            style={{ margin: '0 5px', cursor: 'pointer' }}
            onClick={hidePreview}
          />
        }
      >
        {panes?.map((pane) => (
          <TabPane
            tab={
              <span>
                {fileIcons[getFileType(pane.key as string).type as 'png'] || (
                  <FileOutlined />
                )}
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
