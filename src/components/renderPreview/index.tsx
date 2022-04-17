import { makeShadowRaw, setStyle } from '@/utils/reload';
import { fileTransform } from '@/utils/file';
import { destoryPreview } from '@/utils/reload';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react';
import { RenderProps } from 'types';
import { CONSOLE_TYPES, RENDER_PREVIEW_TOOL } from '@/contants/render';
import { observerEl, disConnectObs } from '@/utils/reload';
import { RENDER_PREVIEW_MODE } from '@/contants';
import styles from './index.less';
import renderVue from './vue';
import patchInterval from '@/sandbox/interval';
import patchEventListener from '@/sandbox/listener';
import renderReact from './react';
import { batchConsole } from '@/sandbox/log';
declare global {
  interface Window {
    Vue: any;
    stylus: any;
    Sass: any;
  }
}
let prevX: number;
let prevY: number;
let dragType: 'RIGHT' | 'BOTTOM' = 'RIGHT';
let isStartDrag = false;
let scale = 1;
let vm: any;

function Preview(
  props: RenderProps,
  pref: React.ForwardedRef<Record<string, any>>,
) {
  const ref = useRef<HTMLDivElement>(null);
  const rightDragRef = useRef<HTMLDivElement>(null);
  const bottomDragRef = useRef<HTMLDivElement>(null);
  const refWrap = useRef<HTMLDivElement>(null);
  const transformCenterRef = useRef<HTMLDivElement>(null);
  const previewWrap = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(pref, () => ({
    resize: function (width: number, height: number) {
      prevX = 0;
      prevY = 0;
      if (ref.current && hiddenRef.current && transformCenterRef.current) {
        scale =
          (((previewWrap.current &&
            previewWrap.current?.getBoundingClientRect().width) ||
            500) -
            40) /
            width || 1;
        if (scale >= 1) {
          scale = 1;
        }
        const wrapStyle = {
          width: width * scale + 'px',
          height: height * scale + 'px',
        };
        setStyle(ref.current, {
          width: width + 'px',
          height: height + 'px',
          transform: `scale(${scale})`,
        });
        setStyle(transformCenterRef.current, wrapStyle);
        setStyle(hiddenRef.current, wrapStyle);
        const tipLeft =
          (previewWrap.current &&
            previewWrap.current?.getBoundingClientRect().width / 2 +
              ref.current.getBoundingClientRect().width / 2 +
              5 +
              'px') ||
          '';
        rightDragRef.current && (rightDragRef.current.style.left = tipLeft);
        return scale;
      }
    },
    getVm: function () {
      return vm;
    },
  }));
  useEffect(() => {
    if (props.previewMode === RENDER_PREVIEW_MODE.FULL_SCREEN) {
      scale = 1;
      if (ref.current && hiddenRef.current && transformCenterRef.current) {
        // 缩放回到普通状态去除写入的style属性
        const resetStyle = {
          transform: 'scale(1)',
          width: 'auto',
          height: 'auto',
        };
        setStyle(ref.current, resetStyle);
        setStyle(hiddenRef.current, resetStyle);
        setStyle(transformCenterRef.current, resetStyle);
      }
    }
  }, [props.previewMode]);
  useLayoutEffect(() => {
    // 渲染，编译相关
    const { current: elWrap } = ref;
    elWrap &&
      observerEl(elWrap, function (rect) {
        // depsList 需添加previewMode依赖，否则闭包内访问的值永远是初始化的值，即props.previewMode变化后重新生成闭包函数
        // elWrap.style.transform = `scale(${transform})`;
        props.previewMode !== RENDER_PREVIEW_MODE.FULL_SCREEN &&
          props.elObserverChange(
            {
              width: rect.width,
            },
            1,
          );
      });
    elWrap && makeShadowRaw(elWrap);
    const freeInterval = patchInterval(window); // 定时器劫持， 热更新销毁上次创建的所有定时器
    const freeEventListener = patchEventListener(window);
    const files = fileTransform(props.fileSystem);
    if (files['/index.vue']) {
      vm = renderVue({
        files,
        entry: '/index.vue',
        props: props,
        el: elWrap as HTMLElement,
      });
    } else if (files['/index.jsx']) {
      vm = renderReact({
        files,
        entry: '/index.jsx',
        props: props,
        el: elWrap as HTMLElement,
      });
    }
    return function () {
      destoryPreview();
      disConnectObs();
      freeInterval();
      freeEventListener();
    };
  }, [props.fileSystem.files, props.previewMode]);
  useLayoutEffect(() => {
    // 拖拽相关
    function move(e: MouseEvent) {
      if (
        isStartDrag &&
        props.previewMode === RENDER_PREVIEW_MODE.USER_CUSTOM
      ) {
        e.stopPropagation();
        const { x, y } = e;
        const elWrap = transformCenterRef.current;
        const rect = elWrap?.getBoundingClientRect() || { width: 100 };
        // 优先从style获取宽度属性，getBoundClientRect获取的宽度会计算transform scal属性之后的宽度
        if (dragType === 'RIGHT' && rightDragRef.current) {
          if (elWrap && rightDragRef.current && previewWrap.current) {
            const width = rect?.width || 0;
            const deviationX = x - (prevX || x);
            prevX = x;
            elWrap.style.width = width + deviationX * 2 + 'px'; // 因为居中，所以距离需要* 2
            rightDragRef.current.style.left =
              previewWrap.current?.getBoundingClientRect().width / 2 +
              rect.width / 2 +
              5 +
              'px';
          }
        } else {
          if (refWrap.current && bottomDragRef.current) {
            const { height } = refWrap.current.getBoundingClientRect();
            const deviationY = y - (prevY || y);
            prevY = y;
            refWrap.current.style.height = height + deviationY + 'px';
            bottomDragRef.current.style.bottom =
              (refWrap.current.offsetTop | 0) - 10 + 'px';
            props.elObserverChange({ height }, 1);
          }
        }
      }
    }
    function mouseUp() {
      isStartDrag = false;
    }
    document.body.addEventListener('mousemove', move);
    document.body.addEventListener('mouseup', mouseUp);
    return function () {
      document.body.removeEventListener('mousemove', move);
      document.body.removeEventListener('mouseup', mouseUp);
    };
  }, [props.previewMode]);
  return (
    <div
      className={
        props.previewMode === RENDER_PREVIEW_MODE.USER_CUSTOM
          ? styles['preview-wrap']
          : undefined
      }
      ref={previewWrap}
      style={{ margin: '0 10px' }}
    >
      {/* trigger */}
      <div ref={refWrap} style={{ margin: '0 auto', overflow: 'scroll' }}>
        <div
          ref={transformCenterRef}
          style={
            props.previewMode === RENDER_PREVIEW_MODE.USER_CUSTOM
              ? {
                  margin: '0 auto',
                  border: ' solid 1px #e3e8ee',
                  overflow: 'scroll',
                }
              : {}
          }
        >
          <div ref={hiddenRef} style={{ overflow: 'hidden' }}>
            <div
              className={
                props.previewMode === RENDER_PREVIEW_MODE.USER_CUSTOM
                  ? styles['preview-content']
                  : undefined
              }
              id={RENDER_PREVIEW_TOOL}
              ref={ref}
            ></div>
          </div>
        </div>
      </div>
      {props.previewMode === RENDER_PREVIEW_MODE.USER_CUSTOM && (
        <>
          <div
            className={styles['left-drag']}
            onMouseDown={() => {
              dragType = 'RIGHT';
              isStartDrag = true;
            }}
            ref={rightDragRef}
          ></div>
          <div
            className={styles['bottom-drag']}
            onMouseDown={() => {
              dragType = 'BOTTOM';
              isStartDrag = true;
            }}
            ref={bottomDragRef}
          ></div>
        </>
      )}
    </div>
  );
}

export default forwardRef(Preview);
