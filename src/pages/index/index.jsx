import { observer } from 'mobx-react';
import {
  Popconfirm,
  Table,
  Input,
  Button,
  Select,
  Space,
  Pagination,
  Tooltip,
  Modal,
} from 'antd';
import { BarsOutlined, AppstoreFilled, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import moment from 'moment';
import styles from './index.less';
import BasicInfo from './basicInfo';
import { SHOW_MODE, ACTION_TYPE, DEFAULT_PROJECT_LIST } from '@/contants';
import {
  doQueryPage,
  doMaterialRemove,
  doMaterialOn,
  doDeleteMaterial,
} from '@/server';
import get from 'lodash/get';
import copyIcon from '@/assets/img/copy.svg';
import editorIcon from '@/assets/img/editor.svg';
import infoIcon from '@/assets/img/info.svg';
import offIcon from '@/assets/img/off.svg';
import onIcon from '@/assets/img/on.svg';
import defaultBg from '@/assets/img/defaultBg.png';
import greenState from '@/assets/img/greenState.png';
import orangeState from '@/assets/img/orangeState.png';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
const { Search } = Input;
const { Option } = Select;

const Index = (props) => {
  const { history } = props;
  const [searchValue, setSearchValue] = useState('');
  const [project, setProject] = useState('');
  const [mode, setMode] = useState(SHOW_MODE.THUMBNAIL);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [actionType, setActionType] = useState(ACTION_TYPE.ADD);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [dataList, setDataList] = useState([]);
  const [itemInfo, setItemInfo] = useState({});
  const handleDelItem = function (item) {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: 'Bla bla ...',
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        const res = await doDeleteMaterial(item.id);
        message.success('删除成功！');
      },
    });
  };
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
    },
    {
      title: '归属',
      dataIndex: 'project',
      key: 'project',
      width: '25%',
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      width: '15%',
      render: (value) => {
        return (
          <div>
            <>
              <img
                style={{ margin: '-3px 2px 0 0' }}
                src={value ? orangeState : greenState}
                alt=""
              />
              {value ? '未上架' : '已上架'}
            </>
          </div>
        );
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: '15%',
      render: (value) => {
        return moment(value).format('YYYY-MM-DD HH:MM:ss');
      },
    },
    {
      title: '操作',
      key: 'action',
      width: '200px',
      width: '15%',
      render: (record) => {
        return (
          <Space size="middle">
            <a
              onClick={() => {
                goEditorPage(record);
              }}
            >
              编辑
            </a>
            <a
              onClick={() => {
                handleEditorItem(record);
              }}
            >
              基础
            </a>
            <Popconfirm
              title={`是否${record.state ? '上架' : '下架'}该物料`}
              onConfirm={() => {
                handleConfirm(record.id, record.state);
              }}
              okText="确认"
              cancelText="取消"
            >
              {record.state ? (
                <a>上架</a>
              ) : (
                <a style={{ color: '#ff4d4f' }}>下架</a>
              )}
            </Popconfirm>
            <a
              onClick={() => {
                handleCopyItem(record);
              }}
            >
              复制
            </a>
            <a
              onClick={() => {
                handleDelItem(record);
              }}
            >
              删除
            </a>
          </Space>
        );
      },
    },
  ];

  const handleChangeMode = () => {
    setCurrent(1);
    setMode(
      mode === SHOW_MODE.THUMBNAIL ? SHOW_MODE.TABLE : SHOW_MODE.THUMBNAIL,
    );
  };
  const onSearch = (value) => {
    setSearchValue(value);
  };

  const handleChangeProject = (val) => {
    setProject(val);
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
  const handleEditorItem = (item = {}) => {
    showModal();
    setActionType(ACTION_TYPE.EDITOR);
    setItemInfo(item);
  };

  //复制
  const handleCopyItem = (item = {}) => {
    showModal();
    setActionType(ACTION_TYPE.COPY);
    setItemInfo({ id: item.id });
  };

  const onChangePagination = (page) => {
    setCurrent(page);
  };

  const onShowSizeChange = (current, pageSize) => {
    setCurrent(1);
    setPageSize(pageSize);
  };
  const getData = async () => {
    const param = {
      pageSize,
      pageIndex: current,
      name: searchValue,
      project: project,
      type: '',
    };
    const res = await doQueryPage(param);
    const records = get(res, 'data.records', []);
    const count = get(res, 'data.total', []);
    setTotal(count);
    setDataList(records);
  };
  const handleConfirm = async (id, state) => {
    //  1表示 已经下架
    try {
      let res;
      if (state === 1) {
        // 进行上架
        res = await doMaterialOn({ id });
      } else {
        res = await doMaterialRemove({ id });
      }
      getData();
    } catch (error) {}
  };

  const goEditorPage = (item = {}) => {
    history.push({ pathname: '/editor', query: { id: item.id } });
  };
  useEffect(() => {
    getData();
  }, [current, pageSize, project, searchValue, mode]);

  return (
    <div className={styles.index}>
      <div className="header">
        <Select
          className="project"
          showSearch
          optionFilterProp="children"
          onChange={handleChangeProject}
          placeholder="请选择项目"
          allowClear
        >
          {DEFAULT_PROJECT_LIST.map((item, index) => {
            return (
              <Option key={index} value={item}>
                {item}
              </Option>
            );
          })}
        </Select>
        <Search
          className="search"
          placeholder="请输入物料名称"
          onSearch={onSearch}
        />
        <div className="topAction">
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
            <li className="itemBox" key={-1}>
              <div className={styles['add-material']}>
                <span className={styles['icon-wrap']}>
                  <PlusOutlined
                    onClick={handleCreateItem}
                    style={{ fontSize: '60px' }}
                  />
                </span>
              </div>
            </li>
            {dataList.map((item, index) => {
              return (
                <li className="itemBox" key={index}>
                  <div className="action">
                    <Tooltip placement="topLeft" title={'基础'}>
                      <div
                        className="iconBox"
                        onClick={() => {
                          handleEditorItem(item);
                        }}
                      >
                        <img src={infoIcon} alt="" />
                      </div>
                    </Tooltip>
                    <Tooltip placement="topLeft" title={'编辑'}>
                      <div
                        className="iconBox"
                        onClick={() => {
                          goEditorPage(item);
                        }}
                      >
                        <img src={editorIcon} alt="" />
                      </div>
                    </Tooltip>
                    <Tooltip
                      placement="topLeft"
                      title={item.state ? '上架' : '下架'}
                    >
                      <Popconfirm
                        title={`是否${item.state ? '上架' : '下架'}该物料`}
                        onConfirm={() => {
                          handleConfirm(item.id, item.state);
                        }}
                        okText="确认"
                        cancelText="取消"
                      >
                        <div className="iconBox">
                          <img src={item.state ? onIcon : offIcon} alt="" />
                        </div>
                      </Popconfirm>
                    </Tooltip>
                    <Tooltip placement="topLeft" title={'复制'}>
                      <div
                        className="iconBox"
                        onClick={() => {
                          handleCopyItem(item);
                        }}
                      >
                        <img src={copyIcon} alt="" />
                      </div>
                    </Tooltip>
                    <Tooltip placement="topLeft" title="删除">
                      <div
                        className="iconBox"
                        onClick={() => {
                          handleDelItem(item);
                        }}
                      >
                        <DeleteOutlined style={{ color: 'white' }} />
                      </div>
                    </Tooltip>
                  </div>
                  <div className="thumbnail">
                    <img src={item.thumbnail || defaultBg} alt="" />
                  </div>
                  <div className="name">{item.name}</div>
                </li>
              );
            })}
          </ul>
          <Pagination
            className="listPagination"
            current={current}
            onChange={onChangePagination}
            total={total}
            showTotal={(total) => `共 ${total} 条`}
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
              total: total,
              current,
              showTotal: () => {
                return `共 ${total} 条`;
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
