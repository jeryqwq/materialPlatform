declare type CounterStore = {
  count: number;
  handleInc: () => void;
  handleDec: () => void;
};
declare type FileTarget = string | File | MediaSource; //  File对象， 多媒体文件
declare enum FileTypes {
  PNG = 'png',
  JPG = 'jpg',
  JEPG = 'jpeg',
  IMG = 'img',
  SVG = 'svg',
  GIF = 'gif',
  VUE = 'vue',
  JS = 'js',
  MJS = 'mjs',
  CSS = 'css',
  SCSS = 'scss',
  STYLUS = 'stylus',
  MP4 = 'mp4',
  MP3 = 'mp3',
  COMMON = 'common',
}
type FileTypesString = keyof typeof FileTypes;

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
  actives: Set<FileDescription>;
  activeFile: (_: FileDescription) => void;
  saveToLs: (path: string, content: FileTarget) => void;
  reloadFile: () => void;
};
