import React from 'react';
import { Form, Input, message, Modal, Select } from 'antd';
import {
  ACTION_TYPE,
  ACTION_TYPE_TITLE,
  DEFAULT_PROJECT_LIST,
} from '@/contants';
import { doMaterialAdd, doMaterialUpdate } from '@/server';
import { get } from 'lodash';
const { Option } = Select;
const { TextArea } = Input;

const BasicInfo = (props) => {
  const { actionType, visible, itemInfo = {} } = props;
  const { setVisible, getData } = props;
  const [form] = Form.useForm();

  const saveData = async (values) => {
    let res;
    const actionMap = {
      [ACTION_TYPE.ADD]: async () => {
        const cssType = get(values, 'cssType', '');
        values.cssType = cssType.toString(); // 存储转换字符串
        res = await doMaterialAdd(values);
        if (res.code === 200) {
          message.success('创建成功');
        }
      },
      [ACTION_TYPE.EDITOR]: async () => {
        values.id = itemInfo.id;
        res = await doMaterialUpdate(values);
        if (res.code === 200) {
          message.success('创建成功');
        }
      },
      [ACTION_TYPE.COPY]: async () => {
        values.id = itemInfo.id;
        res = await doMaterialUpdate(values);
        if (res.code === 200) {
          message.success('复制成功');
        }
      },
    };
    try {
      actionMap[actionType] && actionMap[actionType]();
      setVisible(false);
      getData();
    } catch (error) {}
  };
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('Success:', values);
      saveData(values);
    } catch (errorInfo) {
      console.error('Failed:', errorInfo);
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleChange = () => {};

  return (
    <Modal
      title={`${ACTION_TYPE_TITLE[actionType]}物料`}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="确认"
      cancelText="取消"
      maskClosable={false}
    >
      <Form
        form={form}
        name="basicInfo"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        initialValues={itemInfo}
        autoComplete="off"
      >
        <Form.Item
          label="名称"
          name="name"
          rules={[{ required: true, message: '请输入名称!' }]}
        >
          <Input maxLength="32" value />
        </Form.Item>
        {actionType === ACTION_TYPE.ADD && (
          <Form.Item
            label="样式"
            name="cssType"
            rules={[{ required: true, message: '请选择样式!' }]}
          >
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="请选择样式"
              optionFilterProp="children"
              onChange={handleChange}
            >
              <Option key="1">scss</Option>
              <Option key="2">stylus </Option>
              <Option key="3">css </Option>
            </Select>
          </Form.Item>
        )}
        {[ACTION_TYPE.ADD, ACTION_TYPE.COPY].includes(actionType) && (
          <Form.Item
            label="类型"
            name="type"
            rules={[{ required: true, message: '请选择类型!' }]}
          >
            <Select
              style={{ width: '100%' }}
              placeholder="请选择类型"
              optionFilterProp="children"
              onChange={handleChange}
            >
              <Option key="1">组件</Option>
              <Option key="2">区块</Option>
            </Select>
          </Form.Item>
        )}
        <Form.Item
          label="项目"
          name="project"
          rules={[{ required: true, message: '请输入项目!' }]}
        >
          <Select
            style={{ width: '100%' }}
            placeholder="请选择项目"
            onChange={handleChange}
          >
            {DEFAULT_PROJECT_LIST.map((item) => {
              return <Option value={item}>{item}</Option>;
            })}
          </Select>
        </Form.Item>
        {[ACTION_TYPE.ADD, ACTION_TYPE.COPY].includes(actionType) && (
          <>
            <Form.Item
              label="版本"
              name="version"
              rules={[{ required: true, message: '请输入版本!' }]}
            >
              <Input maxLength="32" />
            </Form.Item>
          </>
        )}
        <Form.Item label="简介" name="description">
          <TextArea rows={4} maxLength="256" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BasicInfo;
