export const isImgFile = function (path: string) {
  return /\w(\.gif|\.jpeg|\.png|\.jpg|\.bmp)/i.test(path);
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
  const fileType = isImg ? FileTypes.img : fileInfo.type;
  // const adaptBlob = typeof content === 'string' ? new Blob([content]): content
  // const url = window.URL.createObjectURL(adaptBlob)
  if (fileInfo.type) {
    path2UrlMap[path] = '';
    cb &&
      cb('', {
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
