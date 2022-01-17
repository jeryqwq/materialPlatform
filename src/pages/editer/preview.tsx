import { Input } from 'antd';
import React from 'react';
import Console from './console';
import styles from './index.less'
function Preview() {
  return (
    <div style={{height: '100%', margin: '0 20px 0 20px' }}>
       <div className={styles['util-btn']}>
        <span className={styles['font-label']}>W:</span> <Input size="small" placeholder="宽度" style={{ width: '60px' }}/>
        <span className={styles['font-label']}>H:</span> <Input size="small" placeholder="高度" style={{ width: '60px' }}/>
        <span className={styles['font-label']}>缩放比例 /</span>
       </div>
      <div style={{  height: '50%'}} ref={ (node) => { node?.style.setProperty('background', 'white', 'important')} }></div>
      <Console />
    </div>
  );
}

export default Preview;
