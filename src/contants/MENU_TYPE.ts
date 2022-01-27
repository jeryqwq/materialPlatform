export const MENU_FILE = 'MENU_FILE';
export const MENU_FOLDER = 'MENU_FOLDER';
export const MENU_FILE_HISTORY = 'MENU_FILE_HISTORY';
export const CONTEXT_MENU_FOLDER = [
  {
    value: 'addFile',
    title: '新增文件',
  },
  {
    value: 'addFolder',
    title: '新增文件夹',
  },
  {
    value: 'upload',
    title: '上传文件',
  },
  {
    value: 'rename',
    title: '重命名',
  },
  {
    value: 'copyPath',
    title: '复制路径',
  },
  {
    value: 'delete',
    title: '删除',
  },
  {
    value: 'download',
    title: '下载到本地',
  },
];

export const CONTEXT_MENU_FILE = [
  {
    value: 'rename',
    title: '重命名',
  },
  {
    value: 'copyPath',
    title: '复制路径',
  },
  {
    value: 'delete',
    title: '删除',
  },
  {
    value: 'download',
    title: '下载到本地',
  },
  {
    value: 'copyContent',
    title: '复制内容',
  },
];
export const EVENT_HANDLE_MAP_FILE = {};
export const EVENT_HANDLE_MAP_FOLDER: Record<
  string,
  (fs: FileSys, path: string) => void
> = {
  addFile: function (fs, path) {},
  addFolder: function (fs, path) {},
};
