import React, { useState } from 'react';
import { ReactPropsWithRouter } from 'types';
import styles from './layout.less'
import IndexProvider from '@/provider/index'
import ProLayout, { PageContainer, SettingDrawer } from '@ant-design/pro-layout';
import type { ProSettings } from '@ant-design/pro-layout';
import {
  UserOutlined,
} from '@ant-design/icons';
import { editerPages } from '@/routes';

function LayoutIndex(props: ReactPropsWithRouter) {
  const [collapsed, setCollapsed] = useState(false)
  const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({ fixSiderbar: true, navTheme: 'realDark' });
  const pathname = props.route.path
  return (
    <IndexProvider>
      <div
      id="pro-layout"
      style={{
        height: '100vh'
      }}
    >
      <ProLayout
        route= {editerPages}
        location={{
          pathname,
        }}
        collapsed={true}
        contentStyle={{ margin: 0 }}
        // waterMarkProps={{
        //   content: 'Vis Layout',
        // }}
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
              props.history.push(`${item.path || '/welcome'}?`)
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
        {...settings}
      >
        { props.children }
      </ProLayout>
      <SettingDrawer
        pathname={pathname}
        enableDarkTheme
        getContainer={() => document.getElementById('pro-layout')}
        settings={settings}
        onSettingChange={(changeSetting) => {
          setSetting(changeSetting);
        }}
        disableUrlParams
      />
    </div>
    </IndexProvider>
  );
}

export default LayoutIndex;
