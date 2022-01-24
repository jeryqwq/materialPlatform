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
    style.classList.add('vis-style-tag');
    style.id = `${scopedId}-vis-style`;
    style.textContent = content;
    // const ref = document.head.getElementsByTagName('style')[0] || null;
    (shadowEl || document.head).appendChild(style);
  }
};
export const destoryPreview = function () {
  const styles = document.getElementsByClassName(
    'vis-style-tag',
  ) as unknown as Array<HTMLElement>;
  styles.forEach((element) => {
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
