import React, { useState, useEffect } from 'react';
import { Form, Input, message, Modal, Select } from 'antd';
import { ACTION_TYPE } from '@/contants';
import { doMaterialAdd, doMaterialUpdate } from '@/server';
const { Option } = Select;
const { TextArea } = Input;

const BasicInfo = (props) => {
  const { actionType, visible } = props;
  const { setVisible } = props;
  const [form] = Form.useForm();

  // useEffect(() => {
  //   form.validateFields(['name']);
  // }, []);
  const saveData = async (values) => {
    if (actionType === ACTION_TYPE.ADD) {
      const res = await doMaterialAdd(values);
      console.log(res);
    } else {
      const res = await doMaterialUpdate(values);
      console.log(res);
    }
  };
  const handleOk = async () => {
    // form.submit();
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
      title={(actionType === ACTION_TYPE.ADD ? '新增' : '编辑') + '基础信息'}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="确认"
      cancelText="取消"
    >
      <Form
        form={form}
        name="basicInfo"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        initialValues={{ remember: true }}
        // onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="名称"
          name="name"
          rules={[{ required: true, message: '请输入名称!' }]}
        >
          <Input maxLength="30" />
        </Form.Item>

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
            // defaultValue={['a10', 'c12']}
            onChange={handleChange}
          >
            <Option key="1">1</Option>
            <Option key="2">2</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="类型"
          name="type"
          rules={[{ required: true, message: '请选择类型!' }]}
        >
          <Select
            style={{ width: '100%' }}
            placeholder="请选择类型"
            // defaultValue={['a10', 'c12']}
            onChange={handleChange}
          >
            <Option key="1">1</Option>
            <Option key="2">2</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="项目"
          name="project"
          rules={[{ required: true, message: '请输入项目!' }]}
        >
          <Input maxLength="30" />
        </Form.Item>

        <Form.Item
          label="版本"
          name="version"
          rules={[{ required: true, message: '请输入版本!' }]}
        >
          <Input maxLength="30" />
        </Form.Item>

        <Form.Item label="简介" name="description">
          <TextArea rows={4} maxLength="256" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BasicInfo;
