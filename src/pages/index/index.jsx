import counterStore from '@/stores/Counter';
import { inject, observer } from 'mobx-react';
import { Table, Input, Button, Select, Space, Modal } from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';
import BasicInfo from './basicInfo';
import { SHOW_MODE, ACTION_TYPE } from '@/contants';

const { Search } = Input;
const { Option } = Select;

let dataSource = [];
for (let index = 0; index < 24; index++) {
  dataSource.push({
    key: index,
    name: '胡彦斌',
    age: index,
    address: '西湖区湖底公园1号',
    src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  });
}

const Index = (props) => {
  console.log('===', props);
  const [mode, setMode] = useState(SHOW_MODE.TABLE);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [actionType, setActionType] = useState(ACTION_TYPE.ADD);

  const [dataList, setDataList] = useState([]);

  const {
    location: { query },
    history,
  } = props;
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '版本',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '更新时间',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => {
        return (
          <Space size="middle">
            <a
              onClick={() => {
                handleEditorItem(record.key);
              }}
            >
              编辑
            </a>
            <a>基础</a>
            <a style={{ color: 'red' }}>下架</a>
          </Space>
        );
      },
    },
  ];
  const onSearch = (value) => console.log(value);
  const handleChange = (value) => {
    setMode(value);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCreateItem = () => {
    // 新增
    showModal();
    setActionType(ACTION_TYPE.ADD);
  };
  const handleEditorItem = (id) => {
    console.log('===', id);
    // 新增
    showModal();
    setActionType(ACTION_TYPE.EDITOR);
  };

  useEffect(() => {
    setDataList(dataSource);
  }, []);
  return (
    <div className={styles.index}>
      <div className="header">
        <Search
          style={{ width: 304 }}
          placeholder="input search text"
          onSearch={onSearch}
          enterButton
        />
        <Button type="primary" onClick={handleCreateItem}>
          创建
        </Button>
      </div>

      <div className="filterBox">
        <Space size="middle">
          展示方式 :
          <Select
            defaultValue={SHOW_MODE.THUMBNAIL}
            style={{ width: 120 }}
            onChange={handleChange}
          >
            <Option value={SHOW_MODE.THUMBNAIL}>缩略图</Option>
            <Option value={SHOW_MODE.TABLE}>列表</Option>
          </Select>
        </Space>
      </div>

      {mode === SHOW_MODE.THUMBNAIL ? (
        <ul className="itemList">
          {dataList.map((item) => {
            return (
              <li className="itemBox" key={item.key}>
                <p className="action">
                  <Button type="primary">基础</Button>
                  <Button
                    onClick={() => {
                      handleEditorItem(item.key);
                    }}
                  >
                    编辑
                  </Button>
                  <Button danger>下架</Button>
                </p>
                <img src={item.src} alt="" />
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="table">
          <Table dataSource={dataSource} columns={columns} />
        </div>
      )}
      {isModalVisible && (
        <BasicInfo
          actionType={actionType}
          visible={isModalVisible}
          setVisible={setIsModalVisible}
        />
      )}
    </div>
  );
};

export default observer(Index);
