import React, { ReactComponentElement } from 'react';
import { inject, observer } from 'mobx-react';

function ReduxWrap(props: { storeNames: Array<string>; Comp: Function }) {
  const { storeNames, Comp } = props;
  const propsType = storeNames.reduce((ac, a) => ({ ...ac, [a]: '' }), {});
  return inject(...storeNames)(
    observer((props: typeof propsType) => <Comp {...props} />),
  );
}

export default ReduxWrap;
