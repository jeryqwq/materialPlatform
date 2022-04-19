import { CDN_SERVER, NPM_PACKAGE_SERVER } from '@/contants/host';

export const searchPackage = function (queryStr: string): Promise<any> {
  return fetch(
    `${CDN_SERVER}libraries?search=${queryStr}&fields=filename,version`,
  );
};
export const loadFileScript = async function (url: string) {
  const res = await fetch(url);
  return res.text();
};
export const getPackageInfo = async function (
  packageName: string,
): Promise<any> {
  const res = await fetch(`${NPM_PACKAGE_SERVER}/package/${packageName}`);
  return res.json();
};
