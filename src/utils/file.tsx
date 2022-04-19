import { TreeDataNode } from 'antd';
import { TreeFile, TreeFileItem } from 'types';
import {
  PictureOutlined,
  FileOutlined,
  RightOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { INIT_PROJECT_KEY, MIME_TYPES } from '@/contants';
export const isImgFile = function (path: string) {
  return ['gif', 'jpeg', 'png', 'jpg', 'bmp'].some((i) =>
    path.endsWith(`.${i}`),
  );
};
export const isResource = function (type: string) {
  const typeArr = type.split('.');
  const fileType = typeArr[typeArr.length - 1];
  return [
    'gif',
    'jpeg',
    'png',
    'jpg',
    'bmp',
    'img',
    'mp4',
    'mp3',
    'pdf',
    'word',
    'exal',
    'ps',
    'mov',
  ].some((i) => i === fileType);
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
export const fileAdapter = function (
  file: FileTarget,
  name: string,
  mimeType?: string,
): string {
  if (file.constructor === File) {
    return window.URL.createObjectURL(file);
  } else if (file.constructor === Uint8Array) {
    // jszip压缩后的buffer格式
    const _file = new File([file], name, {
      type: mimeType,
    });
    return window.URL.createObjectURL(_file);
  } else if (file.constructor === String) {
    return file;
  }
  return '';
};
const path2UrlMap: Record<string, string> = {};
export const resolveFile = function (
  path: string,
  content: FileTarget,
  cb: (url: string, other: any) => void,
) {
  // buffer处理图片等其他文件流， 字符串处理文本内容
  const isImg = isImgFile(path);
  const fileInfo = getFileType(path);
  const fileType = isImg ? 'img' : fileInfo.type; // 忽略图片的类型差异， 全部保存为img(方便做判断)
  const isRes = isResource(fileType); // 是资源类型生成url做预览和持久化
  let url = '';
  if (isRes) {
    url = fileAdapter(content, fileInfo.name, MIME_TYPES[fileInfo.type]);
  } else if (content.constructor === File) {
    // file 类型需要读取内容后写入
    const reader = new FileReader();
    reader.onload = function (event) {
      cb &&
        cb(url, {
          type: fileType as FileTypes,
          compiled: true,
          result: '',
          name: fileInfo.name,
          target: event?.target?.result,
        });
    };
    reader.readAsText(content);
    return;
  }
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
    } else {
      ret[item] = val.url;
    }
  }
  return ret;
};
const img = (
  <img
    src="/imgs/icon/img.png"
    alt="image"
    style={{ width: '15px', transform: 'translateX(-5px)' }}
  />
);
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
  img: img,
  common: <FileOutlined />,
  png: img,
  jpeg: img,
  gif: img,
  jpg: img,
  svg: img,
  mjs: (
    <img
      src="/imgs/icon/js.png"
      alt="vue"
      style={{ width: '15px', transform: 'translateX(-5px)' }}
    />
  ),
  css: (
    <img
      src="/imgs/icon/CSS.png"
      alt="vue"
      style={{ height: '15px', transform: 'translateX(-5px)' }}
    />
  ),
  scss: (
    <img
      src="/imgs/icon/scss.png"
      alt="vue"
      style={{ height: '15px', transform: 'translateX(-5px)' }}
    />
  ),
  jsx: (
    <img
      src="/imgs/icon/react.png"
      alt="vue"
      style={{ height: '15px', transform: 'translateX(-5px)' }}
    />
  ),
  stylus: <FileOutlined />,
  mp4: <VideoCameraOutlined />,
  mov: <VideoCameraOutlined />,
  mp3: <FileOutlined />,
  pdf: <FileOutlined />,
  json: <FileOutlined />,
  ts: (
    <img
      src="/imgs/icon/ts.png"
      alt="vue"
      style={{ height: '15px', transform: 'translateX(-5px)' }}
    />
  ),
};
export const file2Tree = function (fileSystem: FileSys, projectName: string) {
  const { files } = fileSystem;
  const fileTree: TreeFile = [
    { title: projectName, key: INIT_PROJECT_KEY, children: [] },
  ];
  let cacheFiles = new WeakMap<Array<string>, FileDescription>();
  // /a/b/a.vue /a/b.vue /a.vue => [{ title: 'a', children: [ { title: 'b', children: [{ title: 'a.vue' }] },{ title: 'b.vue' } ] }, { title: 'a.vue' }]
  let tempPathArr = [];
  for (const key in files) {
    const element = files[key];
    const path = element.path.split('/').filter((_) => _);
    cacheFiles.set(path, element);
    tempPathArr.push(path);
  }
  // console.log(tempPathArr, cacheFiles)
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
        prevFolder = curFolder;
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
      switcherIcon: fileIcons[file?.type || 'common'] || <FileOutlined />,
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

export const findFileItemByFileTree = function (
  key: string,
  fileTree: TreeFile,
): TreeFileItem | undefined {
  let retNode;
  function deepFind(fileTree: TreeFile) {
    for (let i = 0; i < fileTree.length; i++) {
      const item = fileTree[i];
      if (item.key === key) {
        retNode = item;
        return;
      }
      item.children && deepFind(item.children);
    }
  }
  deepFind(fileTree);
  return retNode;
};
// 命中的关键词展开
export const searchTitleByKeyword = function (
  key: string,
  fileTree: TreeFile,
): Array<string> {
  let ret: Array<string> = [];
  if (!key) return [INIT_PROJECT_KEY];
  function deepChildren(children: TreeFile) {
    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      if ((node.title as string).includes(key)) {
        ret.push(node.key as string);
      }
      node.children && deepChildren(node.children);
    }
  }
  deepChildren(fileTree);
  return ret;
};
// 给命中的关键词标红
export const renderSearchKeywordNode = function (
  key: string,
  title: string,
): React.ReactNode {
  const startIndex = title.indexOf(key);
  if (startIndex > -1) {
    const beforeStr = title.substr(0, startIndex);
    const afterStr = title.substr(startIndex + key.length);
    return (
      <span>
        {beforeStr}
        <a>{key}</a>
        {afterStr}
      </span>
    );
  } else {
    return title;
  }
};

export const renderFilePath = function (path: string) {
  const arrs = path.split('/');
  return (
    <span>
      {arrs.map((i) => {
        return (
          i && (
            <span>
              {' '}
              <RightOutlined style={{ margin: '0 3px' }} /> {i}
            </span>
          )
        );
      })}
    </span>
  );
};

export const getFileDir = function (path: string) {
  const pathArr = path.split('/');
  pathArr.pop();
  return pathArr.join('/');
};
