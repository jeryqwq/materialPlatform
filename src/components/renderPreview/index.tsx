import { makeShadowRaw } from '@/utils/reload';
import { fileTransform, isResource } from '@/utils/file';
import { addStyles, destoryPreview } from '@/utils/reload';
import React, {
  LegacyRef,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import * as loader from 'vue3-sfc-loader-vis';
import { RenderOptions } from 'types';
import depStore from '@/stores/Dependencies';
import sandboxs from '@/sandbox/sandboxInstance';
import { CONSOLE_TYPES, RENDER_PREVIEW_TOOL } from '@/contants/render';
const { renderSandbox } = sandboxs;
declare global {
  interface Window {
    Vue: any;
    stylus: any;
    Sass: any;
  }
}
const Vue = window['Vue'] || {};
const stylus = window['stylus'] || {};
const sass = new window.Sass();
function Preview(props: {
  fileSystem: FileSys;
  options: RenderOptions;
  pushConsole: Function;
}) {
  const ref = useRef<HTMLDivElement>();
  useLayoutEffect(() => {
    destoryPreview();
    const config = {
      files: fileTransform(props.fileSystem),
    };
    const { current: elWrap } = ref;
    const options = {
      moduleCache: {
        vue: Vue,
        stylus: (source: string) => {
          return Object.assign(stylus(source), { deps: () => [] });
        },
        sass: {
          async render(args: any) {
            const { data, file, filename, outFile, sourceMap } = args;
            return new Promise((reslove, reject) => {
              sass.compile(data, function (result: any) {
                reslove({
                  css: result.text,
                  stats: {},
                });
              });
            });
          },
        },
      },
      addStyle: (context: string, scopedId: string, path: string) => {
        addStyles(context, scopedId, { shadowEl: elWrap?.shadowRoot, path });
      },
      handleModule: async function (
        type: string,
        getContentData: Function,
        path: string,
        options: any,
      ) {
        const _window = window as Record<string, any>;
        const depItem = depStore.dependencies[path];
        if (depItem) {
          // 依赖库
          return renderSandbox.proxy[depItem.globalName];
        } else {
          switch (type) {
            case '.css':
              options.addStyle(await getContentData(false));
              return;
            case '.scss': // 处理单个scss文件
              return new Promise((reslove, reject) => {
                sass.compile(options.getFile(path), function (result: any) {
                  result.status !== 3 &&
                    options.addStyle(result.text, undefined, path);
                  reslove(result);
                });
              });
            case '.png':
              return options.getFile(path);
            default:
              if (isResource(type)) {
                return options.getFile(path);
              } else if (_window[path as string]) {
                return _window[path as string];
              }
          }
        }
      },
      getFile(url: string, options: any) {
        if (url === 'scss') return;
        return (
          config.files[url] ||
          props.pushConsole({
            type: CONSOLE_TYPES.ERROR,
            text: [`cant reslove url or module '${url}' `],
          })
        );
      },
      log(type: string, err: string) {
        // compiler error
        // console.log(type, err)
        // props.pushConsole({type: CONSOLE_TYPES.ERROR, text: [err]});
      },
      getResource(pathCx: any, options: any) {
        const { refPath, relPath } = pathCx;
        // console.log(pathCx, refPath, relPath, options)
        const { pathResolve, getFile, log } = options;
        const path = pathResolve(pathCx);
        const pathStr = path.toString();
        return {
          id: pathStr,
          path: path,
          getContent: async () => {
            const res = await getFile(path);
            if (typeof res === 'string' || res instanceof ArrayBuffer) {
              return {
                type: '.' + path.split('.').pop(),
                getContentData: async (asBinary: any) => {
                  if (res instanceof ArrayBuffer !== asBinary)
                    log?.(
                      'warn',
                      `unexpected data type. ${
                        asBinary ? 'binary' : 'string'
                      } is expected for "${path}"`,
                    );
                  return res || 'default';
                },
              };
            }
            return {
              type: '.' + path.split('.').pop(),
              getContentData: () => 'undefined',
            };
          },
        };
      },
    };
    const _loader = loader as { loadModule: Function };
    elWrap && makeShadowRaw(elWrap);
    const prevConsole = window.console;
    window.console = {
      ...prevConsole,
      log(...strs: Array<string>) {
        props.pushConsole({ type: CONSOLE_TYPES.USER, text: strs });
      },
      warn(...strs: Array<string>) {
        props.pushConsole({ type: CONSOLE_TYPES.WARN, text: strs });
      },
      error(...strs: Array<string>) {
        props.pushConsole({ type: CONSOLE_TYPES.ERROR, text: strs });
      },
    };
    // https://v3.cn.vuejs.org/api/global-api.html#createapp
    // https://v3.cn.vuejs.org/api/global-api.html#defineasynccomponent
    // props in vm.$attrs
    Vue.createApp(
      Vue.defineAsyncComponent(async () => {
        const App = await _loader.loadModule('/index.vue', options);
        const prevMounted = App.mounted;
        return {
          ...App,
          mounted() {
            prevMounted && prevMounted.call(this);
            window.console = prevConsole;
          },
        };
      }),
      { a: 1 },
    ).mount(elWrap?.shadowRoot);
    return destoryPreview;
  }, [props.fileSystem.files]);
  return (
    <div id={RENDER_PREVIEW_TOOL} ref={ref as LegacyRef<HTMLDivElement>}></div>
  );
}

export default Preview;
