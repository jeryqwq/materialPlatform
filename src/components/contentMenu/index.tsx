import React, { Component } from 'react';
import { SubMenu, MenuItem, ContextMenu } from 'react-contextmenu';
import { ContextMenuItem } from 'types';
import styles from './index.less';

type ContextMenuProps = {
  contextMenu: Array<ContextMenuItem>;
  id: string;
  handle: (e: MouseEvent, _: ContextMenuItem & { target: HTMLElement }) => void;
};
type ContextMenuState = {
  logs: Array<string>;
};
export default class SimpleMenu extends Component<
  ContextMenuProps,
  ContextMenuState
> {
  constructor(props: ContextMenuProps) {
    super(props);
  }

  handleClick = (e: Event, data: ContextMenuItem) => {
    console.log(data, '---click  void');
  };

  render() {
    return (
      <div className={styles['context-menu-wrap']}>
        <div></div>
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
                {i.title}
              </MenuItem>
            ),
          )}

          {/* <SubMenu title="A SubMenu">
            <MenuItem onClick={this.handleClick} data={{ item: 'subitem 1' }}>
              SubItem 1
            </MenuItem>
            <SubMenu title="Another SubMenu">
              <MenuItem
                onClick={this.handleClick}
                data={{ item: 'subsubitem 1' }}
              >
                SubSubItem 1
              </MenuItem>
              <MenuItem
                onClick={this.handleClick}
                data={{ item: 'subsubitem 2' }}
              >
                SubSubItem 2
              </MenuItem>
            </SubMenu>
            <SubMenu title="Yet Another SubMenu">
              <MenuItem
                onClick={this.handleClick}
                data={{ item: 'subsubitem 3' }}
              >
                SubSubItem 3
              </MenuItem>
              <MenuItem
                onClick={this.handleClick}
                data={{ item: 'subsubitem 4' }}
              >
                SubSubItem 4
              </MenuItem>
            </SubMenu>
            <MenuItem onClick={this.handleClick} data={{ item: 'subitem 2' }}>
              SubItem 2
            </MenuItem>
          </SubMenu> */}
        </ContextMenu>
      </div>
    );
  }
}
