declare type CounterStore = {
  count: number;
  handleInc: () => void;
  handleDec: () => void;
};
declare type FileTarget = string | File | ArrayBuffer; //  File对象， 多媒体文件
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
  PDF = 'pdf',
  TS = 'ts',
  JSON = 'json',
  MOV = 'mov',
  JSX = 'jsx',
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
  id: number;
};
interface FileSys {
  debounceReload: () => void;
  files: Record<string, FileDescription>;
  actives: Set<FileDescription>;
  activeFile: (_: FileDescription) => void;
  saveToLs: (path: string, content: FileTarget) => void;
  reloadFile: () => void;
  activeKey: string;
  removeFile: (perfix: string) => void;
  removeFolder: (perfix: string) => void;
  removeActiveItem: (_: FileDescription) => void;
  resetFile: () => void;
  updateFile: (path: string, context: string) => void;
  moveFile2Dir: (from: string, to: string) => void;
  moveFile2FileParent: (from: FileDescription, to: string) => void;
}
interface ThemeStore {
  themeConfig: Record<string, any>;
  setTheme: (config: any) => void;
}

declare type Library = {
  version: string;
  versionList: Array<string>;
  target: string;
  loaded?: boolean;
  name: string;
  globalName: string;
  url: string;
};
interface Dependencies {
  dependencies: Record<string, Library>;
  addDep(name: string, value: Library): void;
  getDep(name: string): void;
  removeDep(name: string): void;
  resetDep: () => void;
}
