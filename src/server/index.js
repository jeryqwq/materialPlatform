import axios from './config/axios';

/**
 * 物料新增
 */
export const doMaterialAdd = (params) => {
  return axios.post('/ssa/vis/material/add', params);
};

/**
 * 物料编辑
 */
export const doMaterialUpdate = (params) => {
  return axios.post('/ssa/vis/material/update', params);
};

/**
 * 物料下架
 */
export const doMaterialRemove = (params) => {
  const { id } = params || {};
  return axios.post(`/ssa/vis/material/remove?id=${id}`);
};

/**
 * 物料列表查询（分页）
 */
export const doQueryPage = (params) => {
  return axios.post('/ssa/vis/material/query/page', params);
};

/**
 * 缩略图/物料文件上传
 */
export const doMaterialUpload = (params) => {
  return axios.post('/ssa/vis/material/upload', params);
};

/**
 * 物料版本列表查询（根据ID）
 */
export const doMaterialQueryVersions = (params) => {
  const { id } = params || {};
  return axios.post(`/ssa/vis/material/query/versions?id=${id}`);
};
