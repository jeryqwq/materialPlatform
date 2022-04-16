import styles from './index.less';
import { Console as MyConsole } from 'console-feed';
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import devTool from 'vue-vconsole-devtools';
function VueDevTool(props: {
  vm: any;
  files: Record<string, FileDescription>;
}) {
  const { vm } = props;
  const [logs, setLogs] = useState<
    Array<{ id: string; method: string; data: any[] }>
  >([]);
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
      devTool.initPlugin(wrap);
    }
  }, [props.files]);
  return (
    <iframe
      className={styles['dev-wrap']}
      ref={el as React.LegacyRef<HTMLIFrameElement>}
    >
      {/* <div className={styles['lf-component']}>
      
      </div>
      <div className={styles['rg-data']}>
        <MyConsole logs={logs as any}/>
      </div> */}
    </iframe>
  );
}

export default VueDevTool;
