import { Button, Input, Modal, Switch, Tooltip } from 'antd';
import React, { useCallback, useState } from 'react';
import Console from './console';
import styles from './index.less';
import {
  CreditCardOutlined,
  ExclamationCircleOutlined,
  MobileOutlined,
} from '@ant-design/icons';
import PreviewReact from '@/components/RenderPreview';
import { RenderOptions } from 'types';
import { DRAG_DIRECTION, RENDER_PREVIEW_MODE } from '@/contants';
import { CONSOLE_TYPES } from '@/contants/render';
import DragResize from '@/components/DragBorderResize';

declare type ConsoleType = { type: Symbol; text: Array<any> };
export default (props: { fileSystem: FileSys }) => {
  const [previewMode, setPreviewMode] = useState(
    RENDER_PREVIEW_MODE.FULL_SCREEN,
  );
  const [consoleList, setConsoleList] = useState<Array<ConsoleType>>([
    {
      type: CONSOLE_TYPES.WARN,
      text: [
        'VisCodeEditor Tip: Ctrl + S save your code, support filetype: css, js, vue, html, mp4, mp3, mov, pdf, png, gif, jpeg, jpg ... ',
        'next step: js sandbox ',
      ],
    },
  ]);
  const [containHeightProps, setHeight] = useState<number | string>(500);
  const pushConsole = (prop: ConsoleType) => {
    setConsoleList((val) => val.concat(prop));
  };
  const resetConsole = function () {
    setConsoleList([]);
  };
  const [options, setOptions] = useState<RenderOptions>({
    shadow: true,
    width: 400,
    height: 400,
    scale: 1,
  });
  const miniConsole = useCallback(() => {
    setHeight((val) => (val === '100%' ? 500 : '100%'));
  }, [consoleList]);
  return (
    <div style={{ height: '100%' }} className={styles['preview-containter']}>
      <div className={styles['util-btn']}>
        <div></div>
        {previewMode === RENDER_PREVIEW_MODE.FULL_SCREEN ? null : (
          <div>
            <span className={styles['font-label']}>W:</span>
            <Input
              size="small"
              placeholder="宽度"
              style={{ width: '60px', margin: '0 5px' }}
            />
            <span className={styles['font-label']}>H:</span>
            <Input
              size="small"
              placeholder="高度"
              style={{ width: '60px', margin: '0 5px' }}
            />
            <span className={styles['font-label']}>缩放比例 /</span>
          </div>
        )}
        <div style={{ cursor: 'pointer', fontSize: '15px', marginRight: 20 }}>
          <Switch
            size="small"
            defaultChecked
            checkedChildren="沙箱"
            checked={options.shadow}
            onChange={(checked) => {
              if (!checked) {
                Modal.confirm({
                  title: '提示',
                  icon: <ExclamationCircleOutlined />,
                  content:
                    '关闭沙箱模式可能会导致你的代码受到主应用的其他通用css属性和js代码污染，导致渲染效果和js执行与本地不一致，是否继续关闭？',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: () => setOptions({ ...options, shadow: checked }),
                });
              } else {
                setOptions({ ...options, shadow: checked });
              }
            }}
          />
          <MobileOutlined
            onClick={() => {
              setPreviewMode(RENDER_PREVIEW_MODE.USER_CUSTOM);
            }}
            style={{ margin: '0 5px', color: '#999999' }}
          />
          <CreditCardOutlined style={{ marginLeft: '5px', color: '#999999' }} />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          userSelect: 'none',
        }}
      >
        <DragResize
          style={{
            height: containHeightProps,
          }}
          direction={DRAG_DIRECTION.TOP_BUTTOM}
          min={0}
          max={Infinity}
        >
          <PreviewReact
            fileSystem={props.fileSystem}
            options={options}
            pushConsole={pushConsole}
          ></PreviewReact>
        </DragResize>
        <Console
          consoleList={consoleList}
          resetConsole={resetConsole}
          miniConsole={miniConsole}
        />
      </div>
    </div>
  );
};
