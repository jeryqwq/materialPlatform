import { MENU_KEYS } from '@/contants/MENU_TYPE';
import { Upload } from 'antd';
import React, { Component } from 'react';
import { SubMenu, MenuItem, ContextMenu } from 'react-contextmenu';
import { ContextMenuItem, TreeFileItem } from 'types';
import styles from './index.less';
import { UploadOutlined } from '@ant-design/icons';
type ContextMenuProps = {
  contextMenu: Array<ContextMenuItem>;
  id: string;
  handle: (e: MouseEvent, _: ContextMenuItem & { target: HTMLElement }) => void;
  uploadFile?: (a: File) => void;
};

export default class SimpleMenu extends Component<ContextMenuProps, {}> {
  constructor(props: ContextMenuProps) {
    super(props);
  }

  render() {
    return (
      <div className={styles['context-menu-wrap']}>
        <ContextMenu id={this.props.id}>
          {this.props.contextMenu.map((i) =>
            i.children ? (
              <SubMenu title={i.title}>
                {i.children.map((item) => (
                  <MenuItem
                    key={item.value}
                    onClick={this.props.handle}
                    data={item}
                  >
                    {item.title}
                  </MenuItem>
                ))}
              </SubMenu>
            ) : (
              <MenuItem key={i.value} onClick={this.props.handle} data={i}>
                {i.value === MENU_KEYS.UPLODAD ? (
                  <Upload
                    onChange={(e) => {
                      this.props.uploadFile &&
                        this.props.uploadFile(
                          (e.file as any).originFileObj as File,
                        );
                    }}
                    fileList={[]}
                  >
                    <div style={{ fontSize: '12px', width: '140px' }}>
                      {i.title}
                    </div>
                  </Upload>
                ) : (
                  i.title
                )}
              </MenuItem>
            ),
          )}
        </ContextMenu>
      </div>
    );
  }
}
