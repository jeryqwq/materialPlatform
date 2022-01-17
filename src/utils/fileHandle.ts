export const imgHandler = function (content: File) {
  return window.URL.createObjectURL(new Blob([content]))
}
export const fileHandler = {
  png: imgHandler,
  gif: imgHandler,
  jpeg: imgHandler,
  bmp: imgHandler,
  jpg: imgHandler
}