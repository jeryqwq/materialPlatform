import JSZip, { file } from 'jszip';
import _saveAs from 'jszip/vendor/FileSaver';
import { message } from 'antd';
import { DOWNLOAD_MESSAGE_TIP_KEY } from '@/contants';
import { getFileType, isImgFile, isResource } from './file';
import depStore from '@/stores/Dependencies';
import { loadScript } from './reload';
import { MaterialInfo } from 'types';

export const writeLibFile = function (zip: JSZip, material?: MaterialInfo) {
  let materialJson = {
    ...(material || {}),
    dependencies: <Record<string, Library>>{},
  };
  for (const key in depStore.dependencies) {
    const item = depStore.dependencies[key];
    materialJson.dependencies[item.name] = { ...item, target: '' };
    zip.file(`/lib/${item.name}`, item.target);
  }
  zip.file('/material.json', JSON.stringify(materialJson));
};

export const resolveZipFile = async function (
  files: Record<string, FileDescription>,
  name: string,
  material?: MaterialInfo,
): Promise<Blob> {
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
    content: '依赖处理中...',
    key: DOWNLOAD_MESSAGE_TIP_KEY,
  });
  writeLibFile(zip, material);
  message.loading({
    content: `正在生成压缩包...`,
    key: DOWNLOAD_MESSAGE_TIP_KEY,
  });
  const fileContent = await zip.generateAsync({ type: 'blob' });
  const saveAs = _saveAs as Function;
  if (name) {
    message.success({
      content: '生成完成，请保存到本地！',
      duration: 2,
      key: DOWNLOAD_MESSAGE_TIP_KEY,
    });
    saveAs(fileContent, name);
  } else {
    message.success({
      content: '压缩包生成完成！',
      duration: 1,
      key: DOWNLOAD_MESSAGE_TIP_KEY,
    });
  }
  return fileContent;
};
export const loadZipFile = async function (
  url: string,
  fs: FileSys,
  cb?: Function,
) {
  const zipBuffer = await loadFileBuffer(url);
  const zipFile = await JSZip.loadAsync(zipBuffer);
  const { files } = zipFile;
  const materialInfo = files['/material.json'] as any;
  let depVersion = null;
  fs.resetFile();
  if (materialInfo) {
    // 解析出依赖的版本
    const materialStr = new TextDecoder().decode(
      materialInfo._data.compressedContent,
    );
    depVersion = JSON.parse(materialStr);
  }
  for (const key in files) {
    const element = files[key];
    if (!element.dir) {
      let { compressedContent } = (element as any)._data;
      const fileType = getFileType(key).type;
      if (isResource(fileType)) {
        //  buffer => file => url
        fs.saveToLs(key, compressedContent);
      } else {
        const context = new TextDecoder().decode(compressedContent);
        if (key.startsWith('/lib/')) {
          // 库
          const libName = getFileType(key).name;
          const lib = depVersion.dependencies[libName];
          depStore.addDep(libName, lib);
          loadScript(document.head, { ...lib, target: context });
        } else {
          // 代码
          fs.saveToLs(key, context);
        }
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
