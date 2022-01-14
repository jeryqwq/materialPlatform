import React from 'react';
import { ReactPropsWithRouter } from 'types';
import styles from './layout.less'
import Provider from '@/provider/index'
function Layout(props: ReactPropsWithRouter) {
  return (
    <Provider>
      <div className={styles['body-wrap']}>
        {props.children && React.Children.map(props.children, child => {
          return React.cloneElement(child as any, {  }); // your props
          })
        }
      </div>
    </Provider>
  );
}

export default Layout;
