import { resolveFile } from '@/utils/file';
import { observable, action, makeAutoObservable } from 'mobx';

class FileSystem implements FileSys {
  @observable files: Record<string, FileDescription> = {};
  @observable actives: Set<FileDescription> = new Set();
  constructor() {
    makeAutoObservable(this);
  }
  @action activeFile = (item: FileDescription) => {
    this.actives.add(item);
  };
  @action reloadFile = () => {
    // hack 触发file对象对应的依赖组件重新刷新
    this.files = { ...this.files };
  };
  @action saveToLs = (path: string, content: FileTarget) => {
    // 数据写入stroge, 只有ctrl + s 的时候才会保存， onchange参数写入内存，没必要每次都保存到硬盘， 做持久化存储
    resolveFile(
      path,
      content,
      (
        url: string,
        other: Pick<FileDescription, 'type' | 'compiled' | 'result' | 'name'>,
      ) => {
        this.files[path] = {
          url,
          target: content,
          path,
          ...other,
        };
      },
    );
  };
}
const fs = new FileSystem();
fs.saveToLs('/a/b.js', `console.log('/a/bjs')`);
fs.saveToLs('/a/b/c.js', `console.log('/a/b/cjs')`);
fs.saveToLs('/assets/vue.png', ``);
fs.saveToLs('/assets/style/style.css', ``);
fs.saveToLs(
  '/index.vue',
  `
    <template>
      <div>这是个渲染的vue模版
        <div style="width: 200px; height: 200px; background: green"></div>
      </div>
    </template>
    <script>
      import '/a/b.js'
    </script>
    <style scoped lang="scss">
  div{
    color: red
  }
    </style>
  `,
);
fs.activeFile(fs.files['/index.vue']);
export default fs;
