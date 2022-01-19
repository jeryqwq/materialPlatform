declare type CounterStore = {
  count: number;
  handleInc: () => void;
  handleDec: () => void;
};
declare type FileTarget = string | File | MediaSource; //  File对象， 多媒体文件
declare enum FileTypes { // 目前支持的解析文件类型
  'png',
  'jpg',
  'jpeg',
  'img', // 适配文件类型， 非后缀
  'svg',
  'gif',
  'vue',
  'js',
  'mjs',
  'css',
  'scss',
  'stylus',
  'mp4',
  'mp3',
}
declare type FileDescription = {
  url: string;
  target: FileTarget;
  type: FileTypes;
  compiled: boolean;
  result: string;
  path: string;
  name: string;
};
declare type FileSys = {
  files: Record<string, FileDescription>;
  actives: Array<FileDescription>;
  activeFile: (_: FileDescription) => void;
  saveToLs: (path: string, content: FileTarget) => void;
};
