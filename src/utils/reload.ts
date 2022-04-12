import {
  VIS_STYLE_CLASSNAME,
  VIS_LIB_SCRIPT_CLASSNAME,
} from '@/contants/render';
import sandbox from '@/sandbox/sandboxInstance';
import { isResource } from './file';
const { renderSandbox } = sandbox;
export const addStyles = function (
  content: string,
  scopedId: string,
  options: {
    path: string;
    shadowEl?: ShadowRoot | null;
  },
) {
  const { path, shadowEl } = options;
  // css 样式热更新和首次加载
  const elId = scopedId || path;
  const elTarget = document.getElementById(`${elId}-vis-style`);
  if (elTarget) {
    // 热更新
    elTarget.textContent = content;
  } else {
    const style = document.createElement('style');
    style.classList.add(VIS_STYLE_CLASSNAME);
    style.id = `${scopedId}-vis-style`;
    style.textContent = content;
    // const ref = document.head.getElementsByTagName('style')[0] || null;
    (shadowEl || document.head).appendChild(style);
  }
};
export const destoryPreview = function () {
  const styles = document.getElementsByClassName(VIS_STYLE_CLASSNAME);
  const scripts = document.getElementsByClassName(VIS_LIB_SCRIPT_CLASSNAME);
  [...styles].forEach((element) => {
    element.parentNode?.removeChild(element);
  });
  [...scripts].forEach((element) => {
    element.parentNode?.removeChild(element);
  });
};
export const makeShadowRaw = function (el: HTMLElement) {
  const childNodes = el.childNodes;
  try {
    const tempEl = document.createDocumentFragment();
    // tempEl.classList.add('sand-box-wrap')
    for (const node of childNodes) {
      tempEl.appendChild(node);
    }
    const oldRootShadowRoot = el.shadowRoot;
    if (oldRootShadowRoot) {
      // console.log(`its already open shadow, attach shadow mutiple times`);
      return;
    } else {
      const shadowRoot = el.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(tempEl);
      return shadowRoot;
    }
  } catch (e) {
    console.error('[shadow] make shadow-root failed', el, childNodes);
  }
};
declare global {
  interface Window {
    define: any;
  }
}
export const removeScript = function (libName: string) {
  const scriptEl = document.getElementById(`vis-lib-${libName}`);
  scriptEl && scriptEl.parentNode?.removeChild(scriptEl);
};
export const loadScript = function (
  el: HTMLElement,
  lib: Library,
  cb?: (name: string, obj?: Record<string, any>) => void,
  global?: Object,
) {
  // https://github.com/microsoft/monaco-editor/issues/2283
  // Can only have one anonymous define call per script file
  //   This usually indicates that a script which was not loaded via the AMD loader invokes define. If the script you are trying to load is authored with UMD or AMD support (probes for existance of define and then invokes it), you can do the following:
  // ensure that the script is loaded before loader.js
  // (or) undefine global.define before loading the script and redefine it after the script has finished loading
  // (or) load the script through the AMD loader e.g. (require(['my/script/module/id'], () => { }, (err) => { }))
  // (or) give up on using AMD and use the ESM variant of the monaco editor
  // 库规范冲突解决
  if (typeof window.define === 'function' && window.define.amd) {
    delete window.define.amd;
  }
  const beforeKeys = Object.keys(window);
  // const beforeWindowKeys = Object.keys(window)
  renderSandbox.active(); // 激活沙箱
  // const scriptEl = document.createElement('script');
  // scriptEl.className = VIS_LIB_SCRIPT_CLASSNAME;
  // scriptEl.id = `vis-lib-${lib.name}`;
  // scriptEl.type = 'text/javascript';
  // 代理window执行 ,
  // 目前先不开启，cdn代码并非所有库都按照标准的umd格式来执行代码，受限于不同的打包插件
  // 且有的第三方库会挂载多个全局变量，解析挂载的key和使用qiankun沙箱机制在某些库下都有问题
  // 测试结果： 沙箱适配jq✅，， therejs 无法适配且全局挂载了多个变量(版本啥的全挂出去了，会导致解析异常)
  // 并非按照标准走, vue: {version: xxx, ...}
  // new Function(`
  // (function(window){
  //   with(window){
  //     ${lib.target}
  //   }
  // })(window.__RENDER_SANDBOX.proxy)
  // `)();
  new Function(`
  ${lib.target}
  `)();
  // scriptEl.textContent = `
  //   ${lib.target}
  // `;
  // scriptEl.src = lib.url
  // el.appendChild(scriptEl);
  // scriptEl.onload = function () {
  const afterKeys = Object.keys(window);
  renderSandbox.inactive(); // 退出沙箱
  let libKey = afterKeys.find((i) => !beforeKeys.includes(i));
  // if(!libKey?.length) { // 未找到库对应的key， 可能是该库并没有按照标准的umd格式，window再找一遍
  //   libKey =  Object.keys(window).find((i) => !beforeWindowKeys.includes(i));
  // }
  cb && cb(libKey || lib.name, ((global || window) as any)[libKey || lib.name]);
  // }
};

const elObserverWeakMap = new WeakMap<HTMLElement, ResizeObserver>();
const elObserverCollection = new Set<HTMLElement>();
export const observerEl = function (el: HTMLElement, cb: (e: DOMRect) => void) {
  const obs = new ResizeObserver(function (domObs) {
    domObs.forEach((i) => {
      if (i.target === el) {
        cb(i.contentRect);
      }
    });
  });
  obs.observe(el, {});
  elObserverWeakMap.set(el, obs);
  elObserverCollection.add(el);
  return obs;
};
export const disConnectObs = function () {
  elObserverCollection.forEach((i) => {
    elObserverWeakMap.get(i)?.unobserve(i);
    elObserverWeakMap.get(i)?.disconnect();
  });
};
export const setStyle = function (
  el: HTMLDivElement,
  props: Record<string, string>,
) {
  for (const key in props) {
    const element = props[key];
    el.style[key as 'margin'] = element;
  }
};

export const cssUrlHandler = function (
  cssStr: string,
  files: Record<string, FileDescription>,
): string {
  let res = cssStr;
  for (const key in files) {
    const item = files[key];
    if (isResource(key)) {
      // 是资源素材的话替换url为blob
      res = item.url && res.replaceAll('.' + key, item.url);
    }
  }
  return res;
};
