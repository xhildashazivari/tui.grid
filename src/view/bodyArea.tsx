import { h, Component } from 'preact';
import { BodyRows } from './bodyRows';
import { ColGroup } from './colGroup';
import { Side, ColumnInfo } from '../store/types';
import { cls } from '../helper/dom';
import { DispatchProps } from '../dispatch/create';
import { connect } from './hoc';
import { FocusLayer } from './focusLayer';

interface OwnProps {
  side: Side;
}

interface StoreProps {
  columns: ColumnInfo[];
  bodyHeight: number;
  totalRowHeight: number;
  scrollTop: number;
  offsetY: number;
}

type Props = OwnProps & StoreProps & DispatchProps;

// only updates when these props are changed
// for preventing unnecessary rendering when scroll changes
const PROPS_FOR_UPDATE: (keyof StoreProps)[] = [
  'columns',
  'bodyHeight',
  'totalRowHeight',
  'offsetY'
];

class BodyAreaComp extends Component<Props> {
  el?: HTMLElement;

  handleScroll = (ev: UIEvent) => {
    const { scrollLeft, scrollTop } = ev.srcElement!;
    const { dispatch } = this.props;

    if (this.props.side === 'R') {
      dispatch('setScrollLeft', scrollLeft);
    }
    dispatch('setScrollTop', scrollTop);
  };

  handleMouseDown = (ev: MouseEvent) => {
    const el = this.el!;
    const { pageX, pageY, shiftKey } = ev;
    const { side, dispatch } = this.props;
    const { top, left } = el.getBoundingClientRect();
    const offsetX = pageX - left + el.scrollLeft;
    const offsetY = pageY - top + el.scrollTop;

    dispatch('mouseDownBody', { offsetX, offsetY, side, shiftKey });
  };

  shouldComponentUpdate(nextProps: Props) {
    const currProps = this.props;
    return PROPS_FOR_UPDATE.some((propName) => nextProps[propName] !== currProps[propName]);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.el!.scrollTop = nextProps.scrollTop;
  }

  render({ side, bodyHeight, totalRowHeight, offsetY }: Props) {
    const areaStyle = { overflow: 'scroll', height: bodyHeight };
    const tableStyle = { overflow: 'visible', top: offsetY };
    const containerStyle = { height: totalRowHeight };

    return (
      <div
        class={cls('body-area')}
        style={areaStyle}
        onScroll={this.handleScroll}
        onMouseDown={this.handleMouseDown}
        ref={(el) => (this.el = el)}
      >
        <div class={cls('body-container')} style={containerStyle}>
          <div class={cls('table-container')} style={tableStyle}>
            <table class={cls('table')}>
              <ColGroup side={side} />
              <BodyRows side={side} />
            </table>
          </div>
          <div class={cls('layer-selection')} style="display: none;" />
          <FocusLayer side={side} />
        </div>
      </div>
    );
  }
}

export const BodyArea = connect<StoreProps, OwnProps>((store, { side }) => {
  const { column, dimension, viewport } = store;
  const { bodyHeight, totalRowHeight } = dimension;
  const { offsetY, scrollTop } = viewport;

  return {
    columns: column.visibleColumns[side],
    bodyHeight,
    totalRowHeight,
    scrollTop,
    offsetY
  };
})(BodyAreaComp);