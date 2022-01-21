import { Tabs } from 'antd';
import { TabPane, TabPaneProps } from 'rc-tabs';
import React from 'react';
type TabPaneItem = TabPaneProps & {
  title: string;
  key: number | string;
  content: React.ReactNode;
};
function FileHistory(props: {
  panes: Array<TabPaneItem>;
  activeKey: string;
  onChange: (_: string) => void;
}) {
  const { panes } = props;
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
        // onEdit={this.onEdit}
      >
        {panes?.map((pane) => (
          <TabPane tab={pane.title} key={pane.key} style={{ height: '100%' }}>
            {pane.content}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
}

export default FileHistory;
