export const MENU_FILE = 'MENU_FILE';
export const MENU_FOLDER = 'MENU_FOLDER';
export const MENU_FILE_HISTORY = 'MENU_FILE_HISTORY';

export const MENU_KEYS = {
  RENAME: 'RENAME',
  COPY_PATH: 'COPY_PATH',
  DELETE: 'DELETE',
  DOWNLOAD: 'DOWNLOAD',
  COPY_CONTENT: 'COPY_CONTENT',
  ADD_FILE: 'ADD_FILE',
  ADD_FOLDER: 'ADD_FOLDER',
  UPLODAD: 'UPLODAD',
  COPY_FILE: 'COPY_FILE',
  PASTE: 'PASTE',
};
export const CONTEXT_MENU_FOLDER = [
  {
    value: MENU_KEYS.ADD_FILE,
    title: '新增文件',
  },
  {
    value: MENU_KEYS.ADD_FOLDER,
    title: '新增文件夹',
  },
  {
    value: MENU_KEYS.UPLODAD,
    title: '上传文件',
  },
  {
    value: MENU_KEYS.RENAME,
    title: '重命名',
  },
  {
    value: MENU_KEYS.COPY_PATH,
    title: '复制路径',
  },
  {
    value: MENU_KEYS.DELETE,
    title: '删除',
  },
  // {
  //   value: MENU_KEYS.DOWNLOAD,
  //   title: '下载到本地',
  // },
];

export const CONTEXT_MENU_FILE = [
  {
    value: MENU_KEYS.RENAME,
    title: '重命名',
  },
  {
    value: MENU_KEYS.COPY_PATH,
    title: '复制路径',
  },
  {
    value: MENU_KEYS.COPY_CONTENT,
    title: '复制内容',
  },
  {
    value: MENU_KEYS.DELETE,
    title: '删除',
  },
];
