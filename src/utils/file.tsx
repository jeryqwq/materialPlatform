import { TreeDataNode } from 'antd';
import { TreeFile, TreeFileItem } from 'types';
import { PictureOutlined, FileOutlined } from '@ant-design/icons';
export const isImgFile = function (path: string) {
  return ['gif', 'jpeg', 'png', 'jpg', 'bmp'].some((i) => path.endsWith(i));
};
export const isResource = function (type: string) {
  return ['img', 'mp4', 'mp3', 'pdf', 'word', 'exal', 'ps', 'html'].some(
    (i) => i === type,
  );
};
export const getFileType = function (path: string) {
  const splitRes = path.split('.');
  const splitLine = path.split('/');
  const filePostfix = splitRes[splitRes.length - 1];
  const name = splitLine[splitLine.length - 1];
  return {
    type: filePostfix,
    name,
  };
};
const path2UrlMap: Record<string, string> = {};
export const resolveFile = function (
  path: string,
  content: FileTarget,
  cb: (
    url: string,
    other: Pick<FileDescription, 'type' | 'compiled' | 'result' | 'name'>,
  ) => void,
) {
  // buffer处理图片等其他文件流， 字符串处理文本内容
  const isImg = isImgFile(path);
  const fileInfo = getFileType(path);
  const fileType = isImg ? 'img' : fileInfo.type; // 忽略图片的类型差异， 全部保存为img(方便做判断)
  const isRes = isResource(fileType); // 是资源类型生成url做预览和持久化
  let url = '';
  if (isRes) {
    url = content && window.URL.createObjectURL(content as File);
    console.log(url, '---');
  }
  // const adaptBlob = typeof content === 'string' ? new Blob([content]): content
  // const url = window.URL.createObjectURL(adaptBlob)
  if (fileInfo.type) {
    path2UrlMap[path] = '';
    cb &&
      cb(url, {
        type: fileType as FileTypes,
        compiled: true,
        result: '',
        name: fileInfo.name,
      });
  } else {
    console.error(
      `unkonw fileType in file on path ${path}, please provide a include file postfix name before upload`,
    );
  }
};
export const fileTransform = function (
  fileSys: FileSys,
): Record<string, string> {
  let ret: Record<string, string> = {};
  const { files } = fileSys;
  for (const item in files) {
    const val = files[item];
    if (typeof val.target === 'string') {
      // 字符串的文件
      ret[item] = val.target;
    } // todo : File => URL 适配多媒体文件
  }
  return ret;
};
export const fileIcons: Record<FileTypes, JSX.Element> = {
  vue: (
    <img
      src="/imgs/icon/Vue.png"
      alt="vue"
      style={{ width: '15px', transform: 'translateX(-5px)' }}
    />
  ),
  js: (
    <img
      src="/imgs/icon/js.png"
      alt="vue"
      style={{ width: '15px', transform: 'translateX(-5px)' }}
    />
  ),
  img: <PictureOutlined />,
  common: <FileOutlined />,
  png: <PictureOutlined />,
  jpeg: <PictureOutlined />,
  gif: <PictureOutlined />,
  jpg: <PictureOutlined />,
  svg: <PictureOutlined />,
  mjs: (
    <img
      src="/imgs/icon/js.png"
      alt="vue"
      style={{ width: '15px', transform: 'translateX(-5px)' }}
    />
  ),
  css: <FileOutlined />,
  scss: <FileOutlined />,
  stylus: <FileOutlined />,
  mp4: <FileOutlined />,
  mp3: <FileOutlined />,
};
export const file2Tree = function (fileSystem: FileSys, projectName: string) {
  const { files } = fileSystem;
  const fileTree: TreeFile = [
    { title: projectName, key: 'project-name', children: [] },
  ];
  let cacheFiles = new WeakMap<Array<string>, FileDescription>();
  // /a/b/a.vue /a/b.vue /a.vue => [{ title: 'a', children: [ { title: 'b', children: [{ title: 'a.vue' }] },{ title: 'b.vue' } ] }, { title: 'a.vue' }]
  let tempPathArr = [];
  for (const key in files) {
    if (Object.prototype.hasOwnProperty.call(files, key)) {
      const element = files[key];
      const path = element.path.split('/').filter((_) => _);
      cacheFiles.set(path, element);
      tempPathArr.push(path);
    }
  }
  tempPathArr.forEach((folder) => {
    const file = cacheFiles.get(folder);
    const fileName = folder.pop();
    let curFolder = fileTree[0],
      prevFolder = fileTree[0];
    for (let i = 0; i < folder.length; i++) {
      const folderName = folder[i];
      curFolder = curFolder?.children?.find(
        (i) => i.title === folderName && !i.isLeaf,
      ) as TreeFileItem;
      if (!curFolder) {
        // 找不到可复用的文件夹（相同前缀的文件夹）
        curFolder = {
          title: folderName,
          key:
            (i === 0 ? '' : '/') +
            folder.slice(0, i).join('/') +
            '/' +
            folderName,
          children: [],
          isLeaf: false,
        };
        prevFolder &&
          prevFolder.children &&
          prevFolder.children.push(curFolder);
      } else {
        // 保存上一个文件夹的记录
        prevFolder = curFolder;
      }
    }
    const fileNode = {
      isLeaf: true,
      title: fileName,
      key: file?.path as string,
      file: file,
      switcherIcon: fileIcons[file?.type || 'common'],
    };
    if (!curFolder) {
      // 根目录的文件
      fileTree?.[0].children?.push(fileNode);
    } else {
      // 非根目录文件
      curFolder?.children?.push(fileNode);
    }
  });
  return fileTree;
};
