import axios from './config/axios';

/**
 * 物料新增
 */
export const doMaterialAdd = (params) => {
  return axios.post('/vis/material/add', params);
};

/**
 * 物料编辑
 */
export const doMaterialUpdate = (params) => {
  return axios.post('/vis/material/update', params);
};

/**
 * 物料下架
 */
export const doMaterialRemove = (params) => {
  const { id } = params || {};
  return axios.get(`/vis/material/remove?id=${id}`);
};

/**
 * 物料上架
 */
export const doMaterialOn = (params) => {
  const { id } = params || {};
  return axios.get(`/vis/material/on?id=${id}`);
};
/**
 * 物料列表查询（分页）
 */
export const doQueryPage = (params) => {
  return axios.post('/vis/material/query/page', params);
};

/**
 * 缩略图/物料文件上传
 */
export const doMaterialUpload = (formData) => {
  return fetch('/vis/material/upload', {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    body: formData,
  });
};

/**
 * 物料版本列表查询（根据ID）
 */
export const doMaterialQueryVersions = (params) => {
  const { id } = params || {};
  return axios.get(`/vis/material/query/versions?id=${id}`);
};

/**
 * 物料复制
 */
export const doMaterialCopy = (params) => {
  return axios.post(`/vis/material/copy`, params);
};

// 物料详情
export const doMaterialDetail = (id) => {
  return axios.get(`/vis/material/query/detail?id=${id}`);
};

// 删除物料
export const doDeleteMaterial = (id) => {
  return axios.get(`/vis/material/delete?id=${id}`);
};
