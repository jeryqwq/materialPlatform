import { Button, Input, Tooltip } from 'antd';
import React from 'react';
import Console from './console';
import styles from './index.less';
import { ChromeOutlined } from '@ant-design/icons';
import PreviewReact from '@/components/renderPreview';

export default (props: { fileSystem: FileSys }) => {
  return (
    <div style={{ height: '100%', margin: '0 20px 0 20px' }}>
      <div className={styles['util-btn']}>
        <span className={styles['font-label']}>W:</span>{' '}
        <Input size="small" placeholder="宽度" style={{ width: '60px' }} />
        <span className={styles['font-label']}>H:</span>{' '}
        <Input size="small" placeholder="高度" style={{ width: '60px' }} />
        <span className={styles['font-label']}>缩放比例 /</span>
        <Tooltip title="打开新页面预览">
          <Button shape="circle" icon={<ChromeOutlined />} />
        </Tooltip>
      </div>
      <div
        style={{ height: '50%' }}
        ref={(node) => {
          node?.style.setProperty('background', 'white', 'important');
        }}
      >
        <PreviewReact fileSystem={props.fileSystem}></PreviewReact>
      </div>
      <Console />
    </div>
  );
};
