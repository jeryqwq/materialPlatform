import { RENDER_PREVIEW_TOOL } from '@/contants/render';
import { Input, Popconfirm } from 'antd';
import { TreeFile, TreeFileItem } from 'types';

export const copyPath = function (str: string) {
  // navigator clipboard api needs a secure context (https)
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard api method'
    return navigator.clipboard.writeText(str);
  } else {
    // text area method
    let textArea = document.createElement('textarea');
    textArea.value = str;
    // make the textarea out of viewport
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise((resolve, reject) => {
      // support http mode
      document.execCommand('copy') ? resolve(true) : reject();
      textArea.remove();
    });
  }
};
let uid = 0;
export const genUid = () => uid++;
export const withInputWrap = function (props: {
  children: JSX.Element;
  title: string;
  cb: (val: string) => void;
}) {
  let temp = '';
  return (
    <Popconfirm
      title={
        <div>
          {props.title}
          <Input
            ref={(e) => e?.focus()}
            onChange={(e) => (temp = e.target.value)}
          />
        </div>
      }
      okText="确定"
      cancelText="取消"
      onConfirm={(e) => {
        e?.stopPropagation;
        props.cb(temp);
        temp = '';
      }}
    >
      {props.children}
    </Popconfirm>
  );
};
export const updateTreeData = function (
  list: TreeFile,
  key: string | number,
  children: TreeFile,
): TreeFile {
  return list.map((node) => {
    if (node.key === key) {
      return { ...node, children };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });
};
export const dataURItoBlob = function (base64Data: string) {
  const bytes = window.atob(base64Data.split(',')[1]);
  const ab = new ArrayBuffer(bytes.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  return new Blob([ab], {
    type: 'image/png',
  });
};
export const html2Image = async function (el: HTMLElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    import('html2canvas').then(({ default: html2image }) => {
      html2image(el, {
        scale: 0.5,
      })
        .then(async (canvas) => {
          resolve(dataURItoBlob(canvas.toDataURL('image/png', 1)));
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  });
};
