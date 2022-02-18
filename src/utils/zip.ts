import JSZip from 'jszip';
import _saveAs from 'jszip/vendor/FileSaver';
import { message } from 'antd';
import { DOWNLOAD_MESSAGE_TIP_KEY } from '@/contants';
import { getFileType, isImgFile, isResource } from './file';

export const resolveZipFile = async function (
  files: Record<string, FileDescription>,
  name: string,
): Promise<JSZip> {
  message.loading({
    content: '初始化压缩包内容...',
    key: DOWNLOAD_MESSAGE_TIP_KEY,
  });
  const zip = new JSZip();
  for (const key in files) {
    const item = files[key];
    message.loading({
      content: `正在处理文件-${item.path}`,
      key: DOWNLOAD_MESSAGE_TIP_KEY,
    });
    if (item.url) {
      // resolve as buffer
      try {
        const buffer = await loadFileBuffer(item.url);
        zip.file(item.path, buffer);
      } catch (error) {
        message.error({
          content: `文件${item.path}处理异常，请检查文件是否存在`,
          key: DOWNLOAD_MESSAGE_TIP_KEY,
        });
      }
    } else {
      // string content
      zip.file(item.path, item.target);
    }
  }
  message.loading({
    content: `正在生成压缩包...`,
    key: DOWNLOAD_MESSAGE_TIP_KEY,
  });
  const fileContent = await zip.generateAsync({ type: 'blob' });
  const saveAs = _saveAs as Function;
  message.success({
    content: '生成完成，请保存到本地！',
    duration: 2,
    key: DOWNLOAD_MESSAGE_TIP_KEY,
  });
  saveAs(fileContent, name);
  return zip;
};
export const loadZipFile = async function (
  url: string,
  fs: FileSys,
  cb?: Function,
) {
  const zipBuffer = await loadFileBuffer(url);
  const zipFile = await JSZip.loadAsync(zipBuffer);
  const { files } = zipFile;
  for (const key in files) {
    const element = files[key];
    if (!element.dir) {
      const {
        compressedContent,
        compression: { compressWorker, uncompressWorker },
      } = (element as any)._data;
      const fileType = getFileType(key).type;
      if (isResource(fileType)) {
        //  buffer => file => url
        fs.saveToLs(key, compressedContent);
      } else {
        fs.saveToLs(key, new TextDecoder().decode(compressedContent));
      }
    }
  }
  cb && cb();
};
export const loadFileBuffer = function (url: string): Promise<ArrayBuffer> {
  const req = new Request(url, { method: 'GET' });
  return new Promise<ArrayBuffer>((resolve) => {
    fetch(req).then((res) => resolve(res.arrayBuffer()));
  });
};
