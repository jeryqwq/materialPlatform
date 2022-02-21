import {
  VIS_STYLE_CLASSNAME,
  VIS_LIB_SCRIPT_CLASSNAME,
} from '@/contants/render';
import { renderSandbox } from '@/sandbox/sandboxInstance';
window.__RENDER_SANDBOX = renderSandbox;
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
  const styles = document.getElementsByClassName(
    VIS_STYLE_CLASSNAME,
  ) as unknown as Array<HTMLElement>;
  const scripts = document.getElementsByClassName(
    VIS_LIB_SCRIPT_CLASSNAME,
  ) as unknown as Array<HTMLElement>;
  styles.forEach((element) => {
    element.parentNode?.removeChild(element);
  });
  scripts.forEach((element) => {
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
      console.log(`its already open shadow, attach shadow mutiple times`);
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

export const loadScript = function (
  el: HTMLElement,
  lib: Library,
  cb: (name: string, obj?: Record<string, any>) => void,
  global?: Object,
) {
  const beforeKeys = Object.keys(global || window);
  renderSandbox.active(); // 激活沙箱
  const scriptEl = document.createElement('script');
  scriptEl.className = VIS_LIB_SCRIPT_CLASSNAME;
  scriptEl.id = `vis-lib-${lib.name}`;
  scriptEl.type = 'text/javascript';
  // 代理window执行
  scriptEl.textContent = `
  (function(window){
    ${lib.target}
  })(window.__RENDER_SANDBOX.proxy)
  `;
  renderSandbox.inactive(); // 退出沙箱

  // scriptEl.src = lib.url
  el.appendChild(scriptEl);
  // scriptEl.onload = function () {
  const afterKeys = Object.keys(global || window);
  const libKey = afterKeys.find((i) => !beforeKeys.includes(i));
  cb && cb(libKey || lib.name, ((global || window) as any)[libKey || lib.name]);
  // }
};
