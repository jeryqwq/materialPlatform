import axios from 'axios';
import { CDN_SERVER, NPM_PACKAGE_SERVER } from '@/contants/host';

export const searchPackage = function (queryStr: string): Promise<any> {
  return axios.get(`${CDN_SERVER}libraries?search=${queryStr}`);
};
export const loadFileScript = function (url: string) {
  return axios.get(url);
};
export const getPackageInfo = function (packageName: string): Promise<any> {
  return axios.get(`${NPM_PACKAGE_SERVER}/package/${packageName}`);
};
