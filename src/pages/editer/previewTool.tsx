import { Button, Input, Modal, Switch, Tooltip } from 'antd';
import React, { useState } from 'react';
import Console from './console';
import styles from './index.less';
import { ChromeOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import PreviewReact from '@/components/RenderPreview';
import { RenderOptions } from 'types';

export default (props: { fileSystem: FileSys }) => {
  const [options, setOptions] = useState<RenderOptions>({
    shadow: true,
    width: 400,
    height: 400,
    scale: 1,
  });
  return (
    <div style={{ height: '100%', margin: '0 20px 0 20px' }}>
      <div className={styles['util-btn']}>
        沙箱模式:
        <Switch
          size="small"
          defaultChecked
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
        <span className={styles['font-label']}>W:</span>{' '}
        <Input size="small" placeholder="宽度" style={{ width: '60px' }} />
        <span className={styles['font-label']}>H:</span>{' '}
        <Input size="small" placeholder="高度" style={{ width: '60px' }} />
        <span className={styles['font-label']}>缩放比例 /</span>
        <Tooltip title="打开新页面预览">
          <Button shape="circle" icon={<ChromeOutlined />} />
        </Tooltip>
      </div>
      {/* ignore element render https://github.com/darkreader/darkreader/issues/4144#issuecomment-729896113 */}
      <div
        style={{ height: '50%', background: 'white' }}
        className="ignore-render"
      >
        <PreviewReact
          fileSystem={props.fileSystem}
          options={options}
        ></PreviewReact>
      </div>
      <Console />
    </div>
  );
};
