import { ReactPropsWithRouter } from 'types';
import styles from './index.less';
import counterStore from '@/stores/Counter';
import { inject, observer } from 'mobx-react';

// 没有provider的函数式组件
export default observer((props: ReactPropsWithRouter) => {
  const {
    location: { query },
    history,
  } = props;
  return (
    <div key={123}>
      receiveVal {query?.val}, storeVal({counterStore.count})
      <h1 className={styles.title}>Page index</h1>
      <button onClick={history.goBack}>back</button>
      <button onClick={counterStore.handleDec}>countStore add</button>
    </div>
  );
});
