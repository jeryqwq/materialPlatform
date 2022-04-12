import { batchConsole, freeConsole } from '@/sandbox/log';
import patchInterval from '@/sandbox/interval';
import patchEventListener from '@/sandbox/listener';
import { cssUrlHandler, makeShadowRaw } from '@/utils/reload';
import { isResource } from '@/utils/file';
import { addStyles } from '@/utils/reload';
import { RenderProps } from 'types';
import * as loader from 'vue3-sfc-loader-vis';
import { CONSOLE_TYPES } from '@/contants/render';

const Vue = window['Vue'] || {};
const stylus = window['stylus'] || {};
export default function (arg: {
  files: Record<string, string>;
  entry: string;
  props: RenderProps;
  el: HTMLElement;
}) {
  const sass = new window.Sass();
  const { files, entry, props, el } = arg;
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
      const replaceUrl = cssUrlHandler(context, props.fileSystem.files);
      addStyles(replaceUrl, scopedId, { shadowEl: el?.shadowRoot, path });
    },
    handleModule: async function (
      type: string,
      getContentData: Function,
      path: string,
      options: any,
    ) {
      const _window = window as Record<string, any>;
      if (isResource(type)) {
        return options.getFile(path);
      }
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
        default:
          if (_window[path as string]) {
            return _window[path as string];
          }
      }
    },
    getFile(url: string, options: any) {
      if (url === 'scss') return;
      return (
        files[url] ||
        props.pushConsole({
          type: CONSOLE_TYPES.ERROR,
          text: [`cant reslove url or module '${url}' `],
        })
      );
    },
    log(type: string, err: string) {
      console.dir(`错误类型： ${type}， 错误内容 ${err}`);
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
  el && makeShadowRaw(el);
  batchConsole(props.pushConsole);
  const freeInterval = patchInterval(window); // 定时器劫持， 热更新销毁上次创建的所有定时器
  const freeEventListener = patchEventListener(window);
  // https://v3.cn.vuejs.org/api/global-api.html#createapp
  // https://v3.cn.vuejs.org/api/global-api.html#defineasynccomponent
  // props in vm.$attrs
  try {
    Vue.createApp(
      Vue.defineAsyncComponent(async () => {
        const App = await _loader.loadModule(entry, options);
        const prevMounted = App.mounted;
        return {
          ...App,
          mounted() {
            prevMounted && prevMounted.call(this);
            freeConsole();
          },
        };
      }),
      { a: 1 },
    ).mount(el?.shadowRoot);
  } catch (error) {
    freeConsole();
  }
  return {
    freeInterval,
    freeEventListener,
  };
}
