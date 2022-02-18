import { request } from 'umi';
import { CDN_SERVER } from '@/contants/host';

export const searchPackage = function (queryStr: string): Promise<any> {
  return request(`${CDN_SERVER}${queryStr}`);
};
export const loadFileScript = function (url: string) {
  return request(url);
};
export const getPackageInfo = function (packageName: string): Promise<any> {
  return request(`https://www.npmjs.com/package/${packageName}`);
};
