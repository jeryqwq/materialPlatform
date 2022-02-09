import { TreeDataNode } from 'antd';
import { ReactChildren } from 'react';
import { match as _RouterMatch } from 'react-router';
import { History, Location } from 'umi';

declare type ReactPropsWithRouter = {
  // 包装函数组件Props的类型，提供函数组件中props代码提示和类型校验
  children: ReactChildren;
  history: History;
  location: Location;
  match: _RouterMatch;
  [key: string]: any;
};
declare type TreeFileItem = TreeDataNode & {
  file?: FileDescription;
  isEditName?: boolean;
  children: Array<TreeFileItem>;
};
declare type TreeFile = Array<TreeFileItem>;
declare type RenderOptions = {
  shadow: boolean;
  width: number;
  height: number;
  scale: number;
};
declare type ContextMenuItem = {
  value: string;
  title: string;
  children?: Array<ContextMenuItem>;
};
