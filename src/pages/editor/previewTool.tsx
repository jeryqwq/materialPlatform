import { Button, Input, Modal, Switch, Tooltip } from 'antd';
import React, { useCallback, useRef, useState } from 'react';
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
        'VisCodeEditor Tip: Ctrl + S 热更新代码, 支持的文件类型: css, js, vue, html, mp4, mp3, mov, pdf, png, gif, jpeg, jpg,json ... ',
        '未完成: js sandbox ',
      ],
    },
  ]);
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
    setOptions((val) => ({
      ...val,
      height: val.height === '100%' ? 400 : '100%',
    }));
  }, []);
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
              value={options.width}
            />
            <span className={styles['font-label']}>H:</span>
            <Input
              size="small"
              placeholder="高度"
              value={options.height}
              style={{ width: '60px', margin: '0 5px' }}
            />
            <span className={styles['font-label']}>
              缩放比例：{options.scale}
            </span>
          </div>
        )}
        <div
          style={{
            cursor: 'pointer',
            fontSize: '15px',
            marginRight: 20,
            display: 'flex',
            alignItems: 'center',
          }}
        >
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
          <img
            src="/imgs/icon/triggerMobile.png"
            onClick={() => {
              setPreviewMode((val) =>
                val === RENDER_PREVIEW_MODE.USER_CUSTOM
                  ? RENDER_PREVIEW_MODE.FULL_SCREEN
                  : RENDER_PREVIEW_MODE.USER_CUSTOM,
              );
            }}
            style={{ margin: '0 5px' }}
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
            height: options.height,
            overflow: 'scroll',
          }}
          direction={DRAG_DIRECTION.TOP_BUTTOM}
          min={0}
          max={Infinity}
        >
          <PreviewReact
            fileSystem={props.fileSystem}
            options={options}
            pushConsole={pushConsole}
            elObserverChange={(rect: DOMRect, scale: number) => {
              previewMode === RENDER_PREVIEW_MODE.USER_CUSTOM &&
                setOptions({
                  ...options,
                  width: rect.width,
                  height: rect.height,
                  scale,
                });
            }}
            previewMode={previewMode}
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
