export const _FILE_TEMP_MARK_NAME = 'FILE_TEMP_MARK_NAME';
export const _FOLDER_TEMP_MARK_NAME = 'FOLDER_TEMP_MARK_NAME';

export const INIT_PROJECT_NAME = 'Files';

export const ACTION_TYPE = {
  ADD: 'add',
  EDITOR: 'editor',
  COPY: 'copy',
};

export const ACTION_TYPE_TITLE = {
  [ACTION_TYPE.ADD]: '新增',
  [ACTION_TYPE.EDITOR]: '编辑',
  [ACTION_TYPE.COPY]: '复制',
};

export const SHOW_MODE = {
  THUMBNAIL: 'thumbnail',
  LIST: 'list',
};
export const DEFAULT_PROJECT_LIST = ['画布', '仪表板', '其他'];

export const DOWNLOAD_MESSAGE_TIP_KEY = 'DOWNLOAD_MESSAGE_TIP_KEY';
export const INIT_PROJECT_KEY = 'INIT_KEY';
// The type represents the general category into which the data type falls, such as video or text.
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
// https://www.iana.org/assignments/media-types/media-types.xhtml#audio
// https://www.iana.org/assignments/media-types/media-types.xhtml#video
// https://www.iana.org/assignments/media-types/media-types.xhtml#image
// mime type 太多， 目前先支持常用即可
export const MIME_TYPES: Record<string, string> = {
  js: 'application/javascript',
  css: 'text/css',
  apng: 'image/apng',
  pdf: 'application/pdf',
  avif: 'image/avif',
  gif: 'image/gif',
  jpeg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
  webp: 'image/webp',
  webm: 'audio/webm',
  wave: 'audio/wave',
  wav: 'video/wav',
  ogg: 'video/ogg',
  mp4: 'video/mp4',
  mp3: 'audio/mp3',
};
export const RENDER_PREVIEW_MODE = {
  // 右侧渲染状态： 全部 ｜ 用户配置（机型｜宽高）
  FULL_SCREEN: Symbol(),
  USER_CUSTOM: Symbol(),
};
export const DRAG_DIRECTION = {
  LEFT_RIGHT: 'LEFT_RIGHT',
  TOP_BUTTOM: 'TOP_BUTTOM',
  RIGHT_LEFT: 'RIGHT_LEFT',
  BUTTOM_TOP: 'BUTTOM_TOP',
};

export const EVENT_BUS_TYPES = {
  HIDE_RIGHT_PREVIEW: Symbol(),
};

export const DIMENSIONS = [
  {
    value: 'Mobile',
    label: 'Mobile',
    width: 320,
    height: 675,
  },
  {
    value: 'Pad',
    label: 'Pad',
    width: 1024,
    height: 765,
  },
  {
    value: 'Desktop',
    label: 'Desktop',
    width: 1366,
    height: 768,
  },
  {
    value: 'DesktopHD',
    label: 'DesktopHD',
    width: 1920,
    height: 1080,
  },
];
