import React, { useEffect, useState } from 'react';
import { MaterialInfo, ReactPropsWithRouter } from 'types';
import styles from './layout.less';
import IndexProvider from '@/provider/index';
import ProLayout, { SettingDrawer } from '@ant-design/pro-layout';
import { editerPages } from '@/routes';
import themeStore from '@/stores/Theme';
import fileStore from '@/stores/Fs';
import {
  Button,
  Dropdown,
  Form,
  FormInstance,
  Input,
  Menu,
  message,
  Modal,
} from 'antd';
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

const { confirm } = Modal;
const { TextArea } = Input;

const material2FromData = async function (material: MaterialInfo) {
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
  return formData;
};

const dropDownMenu = function (material: MaterialInfo) {
  const [form] = Form.useForm();
  return (
    <Menu
      onClick={async (val) => {
        const { key } = val;
        if (key === 'save') {
          const formData = await material2FromData(material);
          message.success('保存成功!');
          doMaterialUpload(formData);
        } else {
          confirm({
            title: '另存为',
            width: 600,
            content: (
              <Form
                form={form}
                name="basicInfo"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                initialValues={material}
                autoComplete="off"
              >
                <Form.Item
                  label="版本号"
                  name="version"
                  rules={[
                    {
                      required: true,
                      message: '请输入版本号!',
                      pattern: /^[1-9]\d?(\.(0|[1-9]\d?)){2}$/,
                    },
                  ]}
                >
                  <Input maxLength={32} />
                </Form.Item>
                <Form.Item label="描述" name="description">
                  <TextArea placeholder="请输入描述内容!" />
                </Form.Item>
              </Form>
            ),
            okText: '确定',
            icon: null,
            okType: 'primary',
            cancelText: '取消',
            async onOk() {
              return new Promise((resolve, reject) => {
                form.validateFields().then(async (values) => {
                  const formData = await material2FromData({
                    ...material,
                    ...values,
                  });
                  await doMaterialUpload(formData);
                  resolve(false);
                });
              });
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
  const [versionList, setVersionList] = useState<Array<any>>([]);
  const [refreshCount, setRefreshCount] = useState<number>(0); // hack
  const [curVersionIndex, setCurVersionIdx] = useState(-1);
  const [materialInfo, setMaterilaInfo] = useState<MaterialInfo>(
    fakeMaterialInfo,
  );
  const { location } = useHistory();
  const id = (location as any).query.id;
  useEffect(() => {
    doMaterialQueryVersions({ id }).then((versions: any) => {
      // 获取版本列表
      setVersionList(versions.data);
      setCurVersionIdx(0);
    });
  }, []);
  useEffect(() => {
    const curMaterial = versionList[curVersionIndex] as MaterialInfo;
    if (curMaterial) {
      curMaterial.path
        ? loadZipFile(curMaterial.path, fileStore, () => {
            fileStore.reloadFile();
          })
        : fileStore.resetFile();
      doMaterialDetail(curMaterial?.id).then((res) => {
        // 获取物料信息
        const materialInfo = res.data as MaterialInfo;
        setMaterilaInfo(materialInfo);
      });
    }
  }, [curVersionIndex]);
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
          menuHeaderRender={() => <img src="/favicon.ico" />}
          collapsedButtonRender={false}
          collapsed={true}
          contentStyle={{ margin: 0 }}
          onMenuHeaderClick={(e) => props.history.push('/')}
          menuItemRender={(item, dom) => (
            <a
              onClick={() => {
                const params = new URLSearchParams(props.location.query as {});
                item.path &&
                  props.history.replace({
                    pathname: '/editor',
                    search:
                      params.toString() + `&type=${item.path.replace('/', '')}`,
                  });
              }}
            >
              {dom}
            </a>
          )}
          headerContentRender={() => (
            <div style={{ textAlign: 'center', fontSize: 16 }}>
              <span
                style={{
                  float: 'left',
                  lineHeight: '32px',
                  marginTop: 8,
                  borderRight: '1px solid #e3e8ee',
                }}
              >
                <Dropdown
                  overlay={
                    <Menu
                      onClick={(val) => {
                        setCurVersionIdx(Number(val.key));
                      }}
                    >
                      {versionList?.map((i, idx) => (
                        <Menu.Item key={idx}>{i.version}</Menu.Item>
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
              {materialInfo?.name}
            </div>
          )}
          rightContentRender={() => (
            <div>
              <Button
                type="primary"
                style={{ marginRight: 10 }}
                onClick={() => props.history.push('/')}
              >
                退出
              </Button>
              <Dropdown
                overlay={dropDownMenu({
                  ...materialInfo,
                  ...versionList[curVersionIndex],
                })}
              >
                <Button type="primary" style={{ marginRight: 42 }}>
                  保存 <DownOutlined />
                </Button>
              </Dropdown>
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
          )}
          {...themeStore.themeConfig}
        >
          {props.children}
        </ProLayout>
      </div>
    </IndexProvider>
  );
}
export default LayoutIndex;
