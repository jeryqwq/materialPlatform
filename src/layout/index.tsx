import React, { useState } from 'react';
import { ReactPropsWithRouter } from 'types';
import styles from './layout.less';
import IndexProvider from '@/provider/index';
import ProLayout, { SettingDrawer } from '@ant-design/pro-layout';
import { editerPages } from '@/routes';
import themeStore from '@/stores/Theme';

function LayoutIndex(props: ReactPropsWithRouter) {
  const pathname = props.route.path;
  const [refreshCount, setRefreshCount] = useState<number>(0); // hack
  return (
    <IndexProvider>
      <div
        id="pro-layout"
        style={{
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <ProLayout
          route={editerPages}
          location={{
            pathname,
          }}
          collapsed={true}
          contentStyle={{ margin: 0 }}
          menuFooterRender={(props) => {
            return (
              <a
                style={{
                  lineHeight: '48rpx',
                  display: 'flex',
                  height: 48,
                  color: 'rgba(255, 255, 255, 0.65)',
                  alignItems: 'center',
                }}
                href="https://preview.pro.ant.design/dashboard/analysis"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  alt="pro-logo"
                  src="https://procomponents.ant.design/favicon.ico"
                  style={{
                    width: 16,
                    height: 16,
                    margin: '0 16px',
                    marginRight: 10,
                  }}
                />
                {!props?.collapsed && 'Preview Pro'}
              </a>
            );
          }}
          onMenuHeaderClick={(e) => console.log(e)}
          menuItemRender={(item, dom) => (
            <a
              onClick={() => {
                props.history.push(`${item.path || '/welcome'}?`);
              }}
            >
              {dom}
            </a>
          )}
          rightContentRender={() => (
            <div style={{ height: '30px' }}>
              {/* <Avatar shape="square" size="small" icon={<UserOutlined />} /> */}
            </div>
          )}
          {...themeStore.themeConfig}
        >
          {props.children}
        </ProLayout>
        <SettingDrawer
          pathname={pathname}
          enableDarkTheme
          getContainer={() => document.getElementById('pro-layout')}
          settings={themeStore.themeConfig}
          onSettingChange={(changeSetting) => {
            themeStore.setTheme(changeSetting);
            setRefreshCount(refreshCount + 1);
          }}
          disableUrlParams={false}
        />
      </div>
    </IndexProvider>
  );
}
export default LayoutIndex;
