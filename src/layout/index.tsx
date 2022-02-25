import React, { useEffect, useState } from 'react';
import { MaterialInfo, ReactPropsWithRouter } from 'types';
import styles from './layout.less';
import IndexProvider from '@/provider/index';
import ProLayout, { SettingDrawer } from '@ant-design/pro-layout';
import { editerPages } from '@/routes';
import themeStore from '@/stores/Theme';
import fileStore from '@/stores/Fs';
import { Button, Dropdown, Form, Input, Menu, Modal } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import {
  doMaterialDetail,
  doMaterialQueryVersions,
  doMaterialUpload,
} from '@/server/index.js';
import { useHistory } from 'umi';
import { fakeMaterialInfo } from '@/contants/initData';
import { html2Image } from '@/utils';
import { RENDER_PREVIEW_TOOL } from '@/contants/render';
import { loadZipFile, resolveZipFile } from '@/utils/zip';
import axios from 'axios';

const { confirm } = Modal;
const { TextArea } = Input;

const dropDownMenu = function (material: MaterialInfo) {
  return (
    <Menu
      onClick={async (val) => {
        const { key } = val;
        if (key === 'save') {
          const formData = new FormData();
          formData.append('id', material.id);
          formData.append('cssType', material.cssType + '');
          formData.append('version', material.version);
          formData.append('type', material.type + '');
          const file1 = await html2Image(
            document.getElementById(RENDER_PREVIEW_TOOL) as HTMLElement,
          );
          formData.append('file1', new File([file1], material.id + '.png'));
          const file2 = await resolveZipFile(fileStore.files, '', material);
          formData.append('file2', new File([file2], material.id + '.zip'));
          doMaterialUpload(formData);
        } else {
          confirm({
            title: '另存为',
            width: 600,
            content: (
              <Form
                // form={form}
                name="basicInfo"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                // initialValues={itemInfo}
                autoComplete="off"
              >
                <Form.Item
                  label="名称"
                  name="name"
                  rules={[{ required: true, message: '请输入名称!' }]}
                >
                  <Input maxLength={32} />
                </Form.Item>
                <Form.Item
                  label="版本号"
                  name="version"
                  rules={[{ required: true, message: '请输入版本号!' }]}
                >
                  <Input maxLength={32} />
                </Form.Item>
                <Form.Item label="描述" name="desc">
                  <TextArea placeholder="请输入描述内容!" />
                </Form.Item>
              </Form>
            ),
            okText: '确定',
            icon: null,
            okType: 'primary',
            cancelText: '取消',
            onOk() {
              console.log('OK');
            },
            onCancel() {
              console.log('Cancel');
            },
          });
        }
      }}
    >
      <Menu.Item key="save">保存</Menu.Item>
      <Menu.Item key="edit">另存为</Menu.Item>
    </Menu>
  );
};

function LayoutIndex(props: ReactPropsWithRouter) {
  const pathname = props.route.path;
  const [refreshCount, setRefreshCount] = useState<number>(0); // hack
  const [versionList, setVersionList] = useState<Array<any>>([]);
  const [curVersionIndex, setCurVersionIdx] = useState(0);
  const [materialInfo, setMaterilaInfo] =
    useState<MaterialInfo>(fakeMaterialInfo);
  const { location } = useHistory();
  const id = (location as any).query.id;
  useEffect(() => {
    doMaterialQueryVersions({ id }).then((res: any) => {
      // 获取版本列表
      setVersionList(res.data);
    });
    doMaterialDetail(id).then((res) => {
      // 获取物料信息
      const materialInfo = res.data as MaterialInfo;
      setMaterilaInfo(materialInfo);
      const zipUrl = `/static/material/1/${materialInfo.id}/${materialInfo.version}`;
      loadZipFile(zipUrl, fileStore, () => {
        fileStore.reloadFile();
      });
    });
  }, []);
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
          headerContentRender={() => (
            <div style={{ textAlign: 'center', fontSize: 16 }}>
              <span style={{ float: 'left' }}>
                <Dropdown
                  overlay={
                    <Menu onClick={() => {}}>
                      {versionList.map((i) => (
                        <Menu.Item key={i.id}>{i.version}</Menu.Item>
                      ))}
                    </Menu>
                  }
                  trigger={['click']}
                >
                  <span
                    style={{
                      cursor: 'pointer',
                      display: 'inline-block',
                      minWidth: 120,
                    }}
                  >
                    {versionList[curVersionIndex]?.version} <DownOutlined />
                  </span>
                </Dropdown>
              </span>
              {materialInfo.name}
            </div>
          )}
          rightContentRender={() => (
            <div>
              <Button type="primary" style={{ marginRight: 10 }}>
                创建
              </Button>
              <Dropdown overlay={dropDownMenu(materialInfo)}>
                <Button type="primary">
                  保存 <DownOutlined />
                </Button>
              </Dropdown>
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
