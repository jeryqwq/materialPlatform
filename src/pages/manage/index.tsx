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
    <div key={123}>
      receive query Val {query?.val}
      <h1>Page index</h1>
      <button onClick={history.goBack}>back</button>
      <button onClick={counterStore.handleDec}>
        {counterStore.count}--countStore add
      </button>
    </div>
  );
};

export default inject('counterStore')(observer(manageIndex));
