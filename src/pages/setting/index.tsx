import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';

const manageIndex = (props: any) => {
  const {
    location: { query },
    history,
    counterStore,
  } = props;
  console.log(props, '----function');
  return <div>配置页面， 如入口文件，编辑器主题。。。</div>;
};

export default manageIndex;
