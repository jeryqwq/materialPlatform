import { CONSOLE_TYPES } from '@/contants/render';
import { Badge, Select } from 'antd';
import React, { useState } from 'react';
import { DownOutlined, ClearOutlined } from '@ant-design/icons';

import styles from './index.less';
declare type ConsolleProps = {
  consoleList: Array<any>;
  resetConsole: Function;
};
const { Option } = Select;

const colors = {
  [CONSOLE_TYPES.USER]: {
    color: 'gray',
    borderBottom: 'solid 1px rgba(128, 128, 128, 0.35)',
    backgroundColor: '#f3eeee',
  },
  [CONSOLE_TYPES.WARN]: {
    color: '#f38115',
    borderBottom: 'solid 1px rgb(245 199 155)',
    backgroundColor: '#fbe0c182',
  },
  [CONSOLE_TYPES.ERROR]: {
    color: '#e72828',
    borderBottom: 'solid 1px #f3a2a2',
    backgroundColor: '#f3dbdb',
  },
};

declare type ConsoleType = 'All' | 'Info' | 'Warn' | 'Error';
function Console(props: ConsolleProps) {
  const { consoleList } = props;
  const [consoleType, setConsoleType] = useState<ConsoleType>('All');
  const consoles = consoleList.filter((i) => i.type === CONSOLE_TYPES.USER);
  const warns = consoleList.filter((i) => i.type === CONSOLE_TYPES.WARN);
  const errors = consoleList.filter((i) => i.type === CONSOLE_TYPES.ERROR);
  let curList =
    consoleType === 'All'
      ? consoleList
      : consoleType === 'Info'
      ? consoles
      : consoleType === 'Warn'
      ? warns
      : consoleType === 'Error'
      ? errors
      : [];
  return (
    <div>
      <div className={styles['console-header']}>
        <Badge count={consoleList.length}>Console</Badge>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ClearOutlined
            style={{ cursor: 'pointer' }}
            onClick={() => props.resetConsole()}
          />
          <Select
            defaultValue="All"
            style={{ width: 80, margin: '0 5px 0 10px' }}
            size={'small'}
            showArrow={false}
            onChange={(val: ConsoleType) => {
              setConsoleType(val);
            }}
          >
            <Option value="All">All</Option>
            <Option value="Info">Info</Option>
            <Option value="Warn">Warn</Option>
            <Option value="Error">Error</Option>
          </Select>
          <DownOutlined />
        </div>
      </div>
      <div className={styles['console-list-wrap']}>
        {curList &&
          curList.map((i) => (
            <div
              className={styles['console-item']}
              style={colors[i.type]}
              title={JSON.stringify(i.text)}
            >
              {i.text.map((i: any) => JSON.stringify(i)).join(',')}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Console;
