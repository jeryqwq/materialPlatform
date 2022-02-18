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
import { BarsOutlined, AppstoreFilled } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import styles from './index.less';
import BasicInfo from './basicInfo';
import { SHOW_MODE, ACTION_TYPE } from '@/contants';
import { doQueryPage, doMaterialRemove } from '@/server';
import { get } from 'lodash';

const { Search } = Input;
const { Option } = Select;

let dataSource = [];
for (let index = 0; index < 10; index++) {
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

const projectList = ['光大A', '光大B', '光大C'];
const Index = (props) => {
  console.log('===', props);
  const [mode, setMode] = useState(SHOW_MODE.THUMBNAIL);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [actionType, setActionType] = useState(ACTION_TYPE.ADD);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // const [total, setTotal] = useState(1);
  const [dataList, setDataList] = useState([]);
  const [itemInfo, setItemInfo] = useState({});
  // const pageSize = 10;

  const {
    location: { query },
    history,
  } = props;
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: '35%',
    },
    {
      title: '归属',
      dataIndex: 'project',
      key: 'project',
      width: '35%',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
    },
    {
      title: '操作',
      key: 'action',
      width: '200px',
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
              <a>下架</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  const onSearch = (value) => console.log(value);
  const handleChangeMode = () => {
    setCurrent(1);
    setMode(
      mode === SHOW_MODE.THUMBNAIL ? SHOW_MODE.TABLE : SHOW_MODE.THUMBNAIL,
    );
  };
  const handleChangeProject = (val) => {
    console.log('===', val);
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

  const onShowSizeChange = (current, pageSize) => {
    console.log('===onShowSizeChange', current, pageSize);
    setPageSize(pageSize);
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

    // setDataList(records);
    setDataList(dataSource);
  };
  const handleConfirm = async (id) => {
    //下架确认
    const res = await doMaterialRemove({ id });
    console.log('===', res);
    getData();
  };

  useEffect(() => {
    getData();
  }, [current, pageSize]);

  return (
    <div className={styles.index}>
      <div className="header">
        <Select
          className="project"
          showSearch
          optionFilterProp="children"
          style={{ width: 120 }}
          onChange={handleChangeProject}
          placeholder="请选择项目"
        >
          {projectList.map((item) => {
            return <Option value={item}>{item}</Option>;
          })}
        </Select>
        <Search
          className="search"
          placeholder="请输入物料名称"
          onSearch={onSearch}
        />
        <div className="action">
          <Button type="primary" onClick={handleCreateItem}>
            创建
          </Button>
          <div className="icon" onClick={handleChangeMode}>
            {mode === SHOW_MODE.THUMBNAIL ? (
              <BarsOutlined style={{ color: '#666666', fontSize: '18px' }} />
            ) : (
              <AppstoreFilled style={{ color: '#666666', fontSize: '18px' }} />
            )}
          </div>
        </div>
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
                  <div className="name">{item.name}</div>
                </li>
              );
            })}
          </ul>
          <Pagination
            className="listPagination"
            current={current}
            onChange={onChangePagination}
            total={dataList.length}
            showTotal={(total) => `共 ${dataList.length} 条`}
            showSizeChanger
            onShowSizeChange={onShowSizeChange}
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
              showTotal: () => {
                return `共 ${dataList.length} 条`;
              },
              onChange: onChangePagination,
              showSizeChanger: true,
              onShowSizeChange,
            }}
            rowClassName={(record, index) =>
              index % 2 === 1 ? 'tableTr tableColorOne' : 'tableTr'
            }
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
