import { Input, Popconfirm } from 'antd';

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
