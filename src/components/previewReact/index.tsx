import { fileTransform } from '@/utils/file';
import React, { useLayoutEffect, useRef } from 'react';
import * as loader from 'vue3-sfc-loader-vis';
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
function Preview(props: { fileSystem: FileSys }) {
  const ref = useRef(null);
  const config = {
    files: fileTransform(props.fileSystem),
  };
  useLayoutEffect(() => {
    const { fileSystem } = props;
    const { current: elWrap } = ref;
    const options = {
      moduleCache: {
        vue: Vue,
        stylus: (source: string) => {
          console.log(Object.assign(stylus(''), { deps: () => [] }));
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
      addStyle(styleStr: string, scopedid: string) {
        console.log(styleStr, scopedid, '---id');
        const style = document.createElement('style');
        style.textContent = styleStr;
        const ref = document.head.getElementsByTagName('style')[0] || null;
        document.head.insertBefore(style, ref);
      },
      handleModule: async function (
        type: string,
        getContentData: Function,
        path: string,
        options: any,
      ) {
        // 解析器优先使用handleModule
        // 配置型或者插件性质的module，放置编译的plugin
        console.log(path, type);
        switch (type) {
          case '.css':
            options.addStyle(await getContentData(false));
            return null;
          case '.png':
            return options.getFile(path);
          case '.scss': // 处理单个scss文件
            return new Promise((reslove, reject) => {
              sass.compile(options.getFile(path), function (result: any) {
                options.addStyle(result.text);
                reslove(result);
              });
            });
        }
      },
      getFile(url: string, options: any) {
        // console.log(url)
        // return config.files[url] || (() => { throw new Error('404 ' + url) })();
        return config.files[url];
      },
      getResource(pathCx: any, options: any) {
        // 其次使用getResource ， 当handleModule返回null或者不返回时， 源码位置 tools.ts:294
        // getResource 偏运行时，能支撑适配运行时参数
        const { refPath, relPath } = pathCx;
        // console.log(refPath, relPath, options)

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
    Vue.createApp(
      Vue.defineAsyncComponent(() => _loader.loadModule('/index.vue', options)),
    ).mount(elWrap as unknown as HTMLElement);
    return () => {};
  }, []);
  return <div ref={ref}></div>;
}

export default Preview;
