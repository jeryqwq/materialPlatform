import { Input, Popconfirm } from 'antd';
import { TreeFile, TreeFileItem } from 'types';

export const copyPath = function (str: string) {};
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
