import counterStore from '@/stores/Counter';
import { inject, observer } from 'mobx-react';
import {
  Popconfirm,
  Table,
  Input,
  Button,
  Select,
  Space,
  Pagination,
} from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';
import BasicInfo from './basicInfo';
import { SHOW_MODE, ACTION_TYPE } from '@/contants';
import { doQueryPage, doMaterialRemove } from '@/server';
import { get } from 'lodash';

const { Search } = Input;
const { Option } = Select;

let dataSource = [];
for (let index = 0; index < 24; index++) {
  dataSource.push({
    key: index,
    id: index,
    name: '胡彦斌',
    type: index,
    project: '西湖区湖底公园1号' + index,
    createTime: '2020/2/15',
    updateTime: '2020/2/16',
    thumbnail:
      'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  });
}

const Index = (props) => {
  console.log('===', props);
  const [mode, setMode] = useState(SHOW_MODE.THUMBNAIL);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [actionType, setActionType] = useState(ACTION_TYPE.ADD);
  const [current, setCurrent] = useState(1);
  // const [total, setTotal] = useState(1);
  const [dataList, setDataList] = useState([]);
  const [itemInfo, setItemInfo] = useState({});
  const pageSize = 10;

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
      title: '项目',
      dataIndex: 'project',
      key: 'project',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (record) => {
        return (
          <Space size="middle">
            <a>编辑</a>
            <a
              onClick={() => {
                handleEditorItem(record.key);
              }}
            >
              基础
            </a>
            <Popconfirm
              title="是否下架该物料?"
              onConfirm={() => {
                handleConfirm(record.id);
              }}
              okText="确认"
              cancelText="取消"
            >
              <a style={{ color: 'red' }}>下架</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  const onSearch = (value) => console.log(value);
  const handleChange = (value) => {
    setCurrent(1);
    setMode(value);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  // 新增
  const handleCreateItem = () => {
    setItemInfo({});
    showModal();
    setActionType(ACTION_TYPE.ADD);
  };
  //编辑
  const handleEditorItem = (item) => {
    console.log('===', item);
    showModal();
    setActionType(ACTION_TYPE.EDITOR);
    setItemInfo(item);
  };
  const onChangePagination = (page) => {
    console.log('===', page);
    setCurrent(page);
  };

  const getData = async () => {
    const param = {
      pageSize,
      pageIndex: current - 1,
      name: '',
      project: '',
      type: '',
    };
    const res = await doQueryPage(param);
    // const { records2 } = res.data;
    const records = get(res, 'data.records', []);
    console.log('===', res, records);

    setDataList(records);
    // setDataList(dataSource);
  };
  const handleConfirm = async (id) => {
    //下架确认
    const res = await doMaterialRemove({ id });
    console.log('===', res);
    getData();
  };

  useEffect(() => {
    getData();
  }, [current]);

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
        <>
          <ul className="itemList">
            {dataList.map((item) => {
              return (
                <li className="itemBox" key={item.id}>
                  <p className="action">
                    <Button
                      type="primary"
                      onClick={() => {
                        handleEditorItem(item);
                      }}
                    >
                      基础
                    </Button>
                    <Button>编辑</Button>

                    <Popconfirm
                      title="是否下架该物料?"
                      onConfirm={() => {
                        handleConfirm(item.id);
                      }}
                      okText="确认"
                      cancelText="取消"
                    >
                      <Button danger>下架</Button>
                    </Popconfirm>
                  </p>
                  <img src={item.thumbnail} alt="" />
                </li>
              );
            })}
          </ul>
          <Pagination
            style={{ textAlign: 'right' }}
            current={current}
            onChange={onChangePagination}
            total={dataList.length}
          />
        </>
      ) : (
        <div className="table">
          <Table
            dataSource={dataList}
            columns={columns}
            pagination={{
              total: dataList.length,
              current,
              onChange: onChangePagination,
            }}
          />
        </div>
      )}
      {isModalVisible && (
        <BasicInfo
          itemInfo={itemInfo}
          actionType={actionType}
          visible={isModalVisible}
          setVisible={setIsModalVisible}
          getData={getData}
        />
      )}
    </div>
  );
};

export default observer(Index);
