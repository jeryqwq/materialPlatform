import JSZip from 'jszip';
import _saveAs from 'jszip/vendor/FileSaver';

export const resolveZipFile = async function (
  files: Record<string, FileDescription>,
  name: string,
): Promise<JSZip> {
  const zip = new JSZip();
  zip.file('/a/b.js', 'console.log(123)');
  const fileContent = await zip.generateAsync({ type: 'blob' });
  const saveAs = _saveAs as Function;
  saveAs(fileContent, name);
  return zip;
};
export const loadZipFile = async function (url: string) {
  const zipBuffer = await loadFileBuffer(url);
  const zipFile = await JSZip.loadAsync(zipBuffer);
  console.log(zipFile, '解析后的压缩包内容');
};
export const loadFileBuffer = function (url: string): Promise<ArrayBuffer> {
  const req = new Request(url, { method: 'GET' });
  return new Promise<ArrayBuffer>((resolve) => {
    fetch(req).then((res) => resolve(res.arrayBuffer()));
  });
};
