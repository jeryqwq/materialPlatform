import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';

const manageIndex = (props: any) => {
  const {
    location: { query },
    history,
    counterStore,
  } = props;
  console.log(props, '----function');
  return (
    <h3 style={{ margin: '20px' }}>
      配置页面，
      如入口文件，参考webpack相关配置，理论上一般常用配置都可以在浏览器内实现，
      包括打包。
    </h3>
  );
};

export default manageIndex;
