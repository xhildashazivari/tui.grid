import { h, Component } from 'preact';
import { MenuItem, MenuPos } from '@t/store/contextMenu';
import { DispatchProps } from '../dispatch/create';
import { connect } from './hoc';
import { isString } from '../helper/common';
import { ContextMenu } from './contextMenu';
import { cls } from '../helper/dom';
import { DEFAULT_SUB_CONTEXT_MENU_TOP } from '../helper/constant';

interface OwnProps {
  menuItem: MenuItem;
}

type Props = OwnProps & DispatchProps;

interface State {
  subMenuInfo: {
    pos: MenuPos;
    menuItems: MenuItem[];
  } | null;
}

class ContextMenuItemComp extends Component<Props, State> {
  private container: HTMLElement | null = null;

  private showSubMenu = (ev: MouseEvent) => {
    const { menuItem } = this.props;

    if (menuItem.subMenu?.length) {
      const { offsetWidth, offsetTop, parentElement } = ev.target as HTMLElement;
      const { innerWidth, innerHeight, scrollX, scrollY } = window;

      let bottom = innerHeight + scrollY - (offsetTop + DEFAULT_SUB_CONTEXT_MENU_TOP);
      let right = innerWidth + scrollX - offsetWidth;

      let element = ev.target as HTMLElement;

      do {
        element = element.parentElement!;

        const { offsetTop: parentOffsetTop, offsetLeft: parentOffsetLeft } = element;

        right -= parentOffsetLeft;
        bottom -= parentOffsetTop;
      } while (!element.className.match(cls('container')));

      const needReverse = this.container!.offsetWidth > right || parentElement!.offsetLeft < 0;

      const resultPos = {
        top: DEFAULT_SUB_CONTEXT_MENU_TOP,
        left: needReverse ? -parentElement!.offsetWidth : offsetWidth,
        right: needReverse ? right + offsetWidth : right,
        bottom,
      };

      const subMenuInfo = { menuItems: menuItem.subMenu, pos: resultPos };

      this.setState({ subMenuInfo });
    }
  };

  private hideSubMenu = () => {
    this.setState({ subMenuInfo: null });
  };

  private execAction = (ev: MouseEvent) => {
    const { menuItem, dispatch } = this.props;
    const { action } = menuItem;

    if (isString(action)) {
      this.props.dispatch(action);
    } else if (action) {
      action();
    }
    ev.stopPropagation();
    dispatch('hideContextMenu');
  };

  createClassNames() {
    const { subMenu, disabled, classNames = [] } = this.props.menuItem;
    const classList = classNames.concat('menu-item');

    if (subMenu) {
      classList.push('has-submenu');
    }

    if (disabled) {
      classList.push('disabled');
    }

    return classList.join(' ');
  }

  render({ menuItem }: Props) {
    const { name, label = '', disabled } = menuItem;

    if (name === 'separator') {
      return <li class="menu-item separator"></li>;
    }

    // eslint-disable-next-line no-undefined
    const getListener = (listener: JSX.MouseEventHandler) => (disabled ? undefined : listener);
    const classNames = this.createClassNames();
    const { subMenuInfo } = this.state;

    return (
      <li
        ref={(ref) => {
          this.container = ref;
        }}
        class={classNames}
        onClick={getListener(this.execAction)}
        onMouseEnter={getListener(this.showSubMenu)}
        onMouseLeave={getListener(this.hideSubMenu)}
      >
        <span dangerouslySetInnerHTML={{ __html: label }} />
        {subMenuInfo && <ContextMenu menuItems={subMenuInfo.menuItems} pos={subMenuInfo.pos} />}
      </li>
    );
  }
}

export const ContextMenuItem = connect<{}, OwnProps>()(ContextMenuItemComp);
