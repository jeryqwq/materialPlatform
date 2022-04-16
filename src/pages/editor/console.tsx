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
import { Console as MyConsole } from 'console-feed';

import styles from './index.less';
import VueDevTool from './devTool';
declare type ConsolleProps = {
  consoleList: Array<any>;
  resetConsole: Function;
  miniConsole: () => void;
  vm: any;
  files: Record<string, FileDescription>;
};
const { Option } = Select;

declare type ConsoleType = 'all' | 'log' | 'info' | 'warn' | 'error';
function Console(props: ConsolleProps) {
  const { consoleList = [], vm } = props;
  const [consoleType, setConsoleType] = useState<ConsoleType>('all');
  const [isOpenConsole, setIsOpen] = useState<boolean>(true);
  const [curMode, setCurMode] = useState<'DEV_TOOL' | 'CONSOLE'>('CONSOLE');
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
          <span
            style={{ color: curMode === 'CONSOLE' ? '#333' : '#999' }}
            onClick={() => setCurMode('CONSOLE')}
          >
            {' '}
            Console
          </span>
        </Badge>
        <Badge
          style={{
            right: -20,
            top: 6,
          }}
        >
          <span
            style={{ color: curMode === 'DEV_TOOL' ? '#333' : '#999' }}
            onClick={() => setCurMode('DEV_TOOL')}
          >
            DevTool
          </span>
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
        {curMode === 'CONSOLE' ? (
          <MyConsole logs={curList} variant="light" />
        ) : (
          <VueDevTool vm={vm} files={props.files} />
        )}
      </div>
    </div>
  );
}

export default Console;
