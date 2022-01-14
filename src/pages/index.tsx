import { ReactPropsWithRouter } from 'types';
import styles from './index.less';
import counterStore from '@/stores/Counter'

export default function IndexPage(props: ReactPropsWithRouter) {
  const { location: { query }, history } = props
  return (
    <div key={123}>
      receiveVal { query?.val }
      <h1 className={styles.title}>Page index</h1>
      <button onClick={history.goBack}>back</button>
      <button onClick={counterStore.handleDec}>countStore add</button>
    </div>
  );
}
