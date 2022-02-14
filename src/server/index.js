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
