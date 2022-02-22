import { CONSOLE_TYPES } from '@/contants/render';
import { Badge, Tag, Tabs } from 'antd';
import React from 'react';
const { TabPane } = Tabs;

declare type ConsolleProps = {
  consoleList: Array<any>;
};
function Console(props: ConsolleProps) {
  const { consoleList } = props;
  return (
    <div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Console" key="1" style={{ height: 200 }}>
          {consoleList
            .filter((i) => i.type === CONSOLE_TYPES.USER)
            .map((i) => (
              <div>{JSON.stringify(i.text)}</div>
            ))}
        </TabPane>
        <TabPane tab="Warn" key="2">
          {consoleList
            .filter((i) => i.type === CONSOLE_TYPES.WARN)
            .map((i) => (
              <div>{JSON.stringify(i.text)}</div>
            ))}
        </TabPane>
        <TabPane tab="Error" key="3">
          {consoleList
            .filter((i) => i.type === CONSOLE_TYPES.ERROR)
            .map((i) => (
              <div>{JSON.stringify(i.text)}</div>
            ))}
        </TabPane>
      </Tabs>
      {/* <Badge count={consoleList.length}>
        { Console }
      </Badge> */}
    </div>
  );
}

export default Console;
