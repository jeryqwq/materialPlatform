import { Input, InputNumber, Modal, Select, Switch } from 'antd';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import Console from './console';
import styles from './index.less';
import {
  CreditCardOutlined,
  ExclamationCircleOutlined,
  MobileOutlined,
} from '@ant-design/icons';
import PreviewReact from '@/components/RenderPreview';
import { RenderOptions } from 'types';
import { DIMENSIONS, DRAG_DIRECTION, RENDER_PREVIEW_MODE } from '@/contants';
import { CONSOLE_TYPES } from '@/contants/render';
import DragResize from '@/components/DragBorderResize';
const { Option } = Select;
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
  const [dimension, setDimension] = useState('');
  const pushConsole = (prop: ConsoleType) => {
    setConsoleList((val) => val.concat(prop));
  };
  const resetConsole = useCallback(function () {
    setConsoleList([]);
  }, []);
  const [isMinoConsole, setIsMiniConsole] = useState(true);
  const [isShadow, setIsShadow] = useState(true);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(400);
  const [width, setWidth] = useState(400);
  const handleDimChange = useCallback((val) => {
    setDimension(val);
    const item = DIMENSIONS.find((i) => i.value === val);
    if (item) {
      const { width, height } = item;
      setWidth(width);
      setHeight(height);
      const scale = previewRef.current.resize(width, height);
      setScale(Number(scale.toFixed(2)));
    }
  }, []);

  const previewRef = useRef<Record<string, any>>({});
  const miniConsole = useCallback(() => {
    setIsMiniConsole(!isMinoConsole);
  }, [isMinoConsole]);

  const resizeHandle = useCallback(() => {
    const scale = previewRef.current.resize(width, height);
  }, [width, height]);
  return (
    <div style={{ height: '100%' }} className={styles['preview-containter']}>
      <div className={styles['util-btn']}>
        <div></div>
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
            checked={true}
            onChange={(checked) => {
              if (!checked) {
                Modal.confirm({
                  title: '提示',
                  icon: <ExclamationCircleOutlined />,
                  content:
                    '关闭沙箱模式可能会导致你的代码受到主应用的其他通用css属性和js代码污染，导致渲染效果和js执行与本地不一致，是否继续关闭？',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: () => setIsShadow(false),
                });
              } else {
                setIsShadow(true);
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
          userSelect: 'none',
          height: 'calc( 100vh - 85px )',
          overflow: 'hidden',
        }}
      >
        {previewMode === RENDER_PREVIEW_MODE.FULL_SCREEN ? null : (
          <div
            style={{
              padding: '15px 0 0 0',
              textAlign: 'center',
              background: '#fafbfd',
            }}
          >
            <InputNumber
              size="small"
              placeholder="宽度"
              style={{ width: '80px', margin: '0 5px' }}
              value={width}
              onChange={(val) => {
                previewRef.current.resize(val, height);
              }}
            />
            <span className={styles['font-label']}>X</span>
            <InputNumber
              size="small"
              placeholder="高度"
              value={height}
              style={{ width: '60px', margin: '0 5px' }}
              onChange={(val) => {
                previewRef.current.resize(width, val);
              }}
            />
            <span className={styles['font-label']}>({scale})</span>
            <Select
              style={{ width: 100 }}
              value={dimension}
              onChange={handleDimChange}
            >
              {DIMENSIONS.map((i) => (
                <Option value={i.value}>{i.label}</Option>
              ))}
            </Select>
          </div>
        )}
        <DragResize
          style={{
            height: isMinoConsole ? '100%' : 'auto',
            overflow: 'scroll',
          }}
          direction={DRAG_DIRECTION.TOP_BUTTOM}
          min={0}
          max={Infinity}
        >
          <PreviewReact
            fileSystem={props.fileSystem}
            pushConsole={pushConsole}
            elObserverChange={(rect: Partial<DOMRect>, scale?: number) => {
              if (previewMode === RENDER_PREVIEW_MODE.USER_CUSTOM) {
                rect.height && setHeight(rect.height);
                rect.width && setWidth(rect.width);
              }
            }}
            previewMode={previewMode}
            ref={previewRef}
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
