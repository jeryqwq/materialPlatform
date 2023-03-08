import styles from './index.less';
import { useLayoutEffect, useRef, useState } from 'react';
import devTool from '@jeryqwq/vue-vconsole-devtools';
function VueDevTool(props: {
  vm: any;
  files: Record<string, FileDescription>;
}) {
  const { vm } = props;
  const el = useRef<HTMLIFrameElement>();
  // window.vm = vm
  // const tabComp = useCallback((comp: any) => {
  //   const attrs = { id: 'attrs', method: 'log', data: [comp.$attrs]}
  //   const data = { id: 'data', method: 'log', data: [comp.$data]}
  //   const el = { id: 'el', method: 'log', data: [comp.$el]}
  //   setLogs([attrs, data, el])
  // }, [])
  useLayoutEffect(() => {
    const wrap = el.current;
    if (wrap && wrap.contentWindow) {
      wrap.contentWindow.document.body.innerHTML = '';
      setTimeout(() => {
        devTool.initPlugin(wrap);
      }, 500);
    }
  }, []);
  return (
    <iframe
      className={styles['dev-wrap']}
      ref={el as React.LegacyRef<HTMLIFrameElement>}
    ></iframe>
  );
}

export default VueDevTool;
