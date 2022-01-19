export const addStyles = function (
  content: string,
  scopedId: string,
  path: string,
) {
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
    const ref = document.head.getElementsByTagName('style')[0] || null;
    document.head.insertBefore(style, ref);
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
