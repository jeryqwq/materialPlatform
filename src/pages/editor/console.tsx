import { CONSOLE_TYPES } from '@/contants/render';
import { Badge, Select } from 'antd';
import React, { useState } from 'react';
import {
  DownOutlined,
  ClearOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { Hook, Console as MyConsole } from 'console-feed';

import styles from './index.less';
declare type ConsolleProps = {
  consoleList: Array<any>;
  resetConsole: Function;
  miniConsole: () => void;
};
const { Option } = Select;

const colors = {
  [CONSOLE_TYPES.USER]: {
    color: 'gray',
    borderBottom: 'solid 1px rgba(128, 128, 128, 0.35)',
    backgroundColor: '#f3eeee',
    icon: <InfoCircleOutlined style={{ margin: '0 5px' }} />,
  },
  [CONSOLE_TYPES.WARN]: {
    color: '#f38115',
    borderBottom: 'solid 1px rgb(245 199 155)',
    backgroundColor: '#fbe0c182',
    icon: <WarningOutlined style={{ margin: '0 5px' }} />,
  },
  [CONSOLE_TYPES.ERROR]: {
    color: '#e72828',
    borderBottom: 'solid 1px #f3a2a2',
    backgroundColor: '#f3dbdb',
    icon: <CloseCircleOutlined style={{ margin: '0 5px' }} />,
  },
};

declare type ConsoleType = 'all' | 'log' | 'info' | 'warn' | 'error';
function Console(props: ConsolleProps) {
  const { consoleList = [] } = props;
  const [consoleType, setConsoleType] = useState<ConsoleType>('all');
  const [isOpenConsole, setIsOpen] = useState<boolean>(true);
  const curList =
    consoleType === 'all'
      ? consoleList
      : consoleList.filter((i) => i.method === consoleType);
  return (
    <div className={styles['console-wrap']}>
      <div className={styles['console-header']}>
        <Badge
          count={curList.length}
          style={{
            right: -20,
            top: 6,
          }}
        >
          Console
        </Badge>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ClearOutlined
            style={{ cursor: 'pointer' }}
            onClick={() => props.resetConsole()}
          />
          <Select
            defaultValue="all"
            style={{ width: 80, margin: '0 5px 0 10px' }}
            size={'small'}
            showArrow={false}
            onChange={(val: ConsoleType) => {
              setConsoleType(val);
            }}
          >
            <Option value="all">All</Option>
            <Option value="info">Info</Option>
            <Option value="warn">Warn</Option>
            <Option value="error">Error</Option>
          </Select>
          <DownOutlined
            onClick={() => {
              props.miniConsole();
              setIsOpen((val) => !val);
            }}
            style={{
              transform: `rotate(${isOpenConsole ? 0 : 180}deg)`,
              transition: 'all .5s',
            }}
          />
        </div>
      </div>
      <div className={styles['console-list-wrap']}>
        <MyConsole logs={curList} variant="light" />
        {/* {curList &&
          curList.map((i, idx) => (
            <div
              className={styles['console-item']}
              style={colors[i.type]}
              title={JSON.stringify(i.text)}
              key={idx}
            >
              {colors[i.type].icon}
              {i.text.map((i: any) => JSON.stringify(i)).join(',')}
            </div>
          ))} */}
      </div>
    </div>
  );
}

export default Console;
