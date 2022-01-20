import { Tabs } from 'antd';
import { TabPane, TabPaneProps } from 'rc-tabs';
import React from 'react';
type TabPaneItem = TabPaneProps & {
  title: string;
  key: number | string;
  content: React.ReactNode;
};
function FileHistory(props: { panes: Array<TabPaneItem> }) {
  const { panes } = props;
  return (
    <div style={{ height: '100%' }}>
      <Tabs
        hideAdd
        // onChange={this.onChange}
        // activeKey={this.state.activeKey}
        tabBarGutter={0}
        type="editable-card"
        size="small"
        // onEdit={this.onEdit}
        style={{ height: '100%' }}
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
