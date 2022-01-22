import { resolveFile } from '@/utils/file';
import { observable, action, makeAutoObservable } from 'mobx';

class FileSystem implements FileSys {
  @observable files: Record<string, FileDescription> = {};
  @observable actives: Set<FileDescription> = new Set();
  @observable activeKey: string = '';
  constructor() {
    makeAutoObservable(this);
  }
  @action activeFile = (item: FileDescription) => {
    this.activeKey = item.path;
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
fs.saveToLs('/assets/style/style.css', ` h1{ color: orange } `);
fs.saveToLs('/assets/style/style.scss', ` h1{ div{ color: orange } } `);
fs.saveToLs(
  '/main.vue',
  `
<template>
  <div>
    这是个渲染的Main.vue组件, 颜色绿
    <h1>H1 Title</h1>
  </div>
</template>
<script>
</script>
<style scoped lang="scss">
  div{
  color: green
  }
</style>
  `,
);
fs.saveToLs(
  '/index.vue',
  `
  <template>
    <div>这是个渲染的vue模版
      <Main />
      <div style="width: 200px; height: 200px; background: green"></div>
    </div>
  </template>
  <script>
    import './a/b.js'
    import Main from './main.vue'
    export default {
      components: { Main }
    }
  </script>
  <style scoped lang="scss">
    div{
    color: red
    }
  </style>
   `,
);
fs.activeFile(fs.files['/index.vue']);
window.fs = fs;
export default fs;
