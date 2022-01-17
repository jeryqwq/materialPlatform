
export const getFileType = function (path: string) {
  return /\w(\.gif|\.jpeg|\.png|\.jpg|\.bmp)/i.test(path)
}
export const resolveFile = function (path: string, content: Buffer | string) { // buffer处理图片等其他文件流， 字符串处理文本内容

}

