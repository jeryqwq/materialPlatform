import { genUid } from '@/utils';
import { getFileDir, resolveFile } from '@/utils/file';
import { loadZipFile } from '@/utils/zip';
import { observable, action, makeAutoObservable } from 'mobx';
import debounce from 'lodash/debounce';
import dep from './Dependencies';
class FileSystem implements FileSys {
  @observable files: Record<string, FileDescription> = {};
  @observable actives: Set<FileDescription> = new Set();
  @observable activeKey: string = '';
  debounceReload: () => void;
  constructor() {
    makeAutoObservable(this);
    this.debounceReload = debounce(this.reloadFile, 500);
  }
  @action activeFile = (item: FileDescription) => {
    this.activeKey = item.path;
    const fileItem = this.files[item.path];
    fileItem && this.actives.add(fileItem);
  };
  @action updateFile = (path: string, context: string) => {
    if (this.files[path]) {
      this.files[path].target = context;
    }
  };
  @action reloadFile = () => {
    // hack 触发file对象对应的依赖组件重新刷新
    this.files = { ...this.files };
  };
  @action resetFile = () => {
    this.files = {};
    this.actives = new Set();
    this.activeKey = '';
    dep.resetDep();
    // this.saveToLs('/index.vue', fileDefault['vue']);
  };
  @action removeFile = (perfix: string) => {
    const item = this.files[perfix];
    item && delete this.files[perfix];
    this.removeActiveItem(item);
  };
  @action removeActiveItem = (item: FileDescription) => {
    this.actives.delete(item);
  };

  @action moveFile2Dir = (target: string, to: string) => {
    const file = this.files[target];
    const fromName = file.name;
    const toPath = to + '/' + fromName;
    file.path = toPath;
    this.removeFile(target);
    this.files[toPath] = file;
    this.reloadFile();
  };
  @action moveFile2FileParent = (target: FileDescription, to: string) => {
    const fileName = target.name;
    const prevPath = target.path;
    const dirStr = getFileDir(to);
    const curPath = dirStr + '/' + fileName;
    target.path = curPath;
    this.files[curPath] = target;
    this.removeFile(prevPath);
    this.reloadFile();
  };
  @action removeFolder = (perfix: string) => {
    for (const key in this.files) {
      const file = this.files[key];
      if (file.path.startsWith(perfix)) {
        // should check path props, in fileTree.tsx can change the filename
        delete this.files[key];
        this.removeActiveItem(file);
      }
    }
  };
  @action saveToLs = (path: string, content: FileTarget) => {
    // 数据写入stroge, 只有ctrl + s 的时候才会保存， onchange参数写入内存，没必要每次都保存到硬盘， 做持久化存储
    resolveFile(path, content, (url: string, other: any) => {
      this.files[path] = {
        url,
        target: content,
        path,
        ...other,
        id: genUid(),
      };
      this.debounceReload();
    });
  };
}
const fs = new FileSystem();
// fs.saveToLs('/a/b.js', `console.log('/a/bjs')`);
// fs.saveToLs('/a/b/c.js', `console.log('/a/b/cjs')`);
// fs.saveToLs('/assets/vue.png', `https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.wangyunw.com%2Ffile%2F20170324%2Fimages%2F63918611ly1fdoygy62ydj20b40b43yj.jpg&refer=http%3A%2F%2Fimg.wangyunw.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1648192713&t=db201b69a1ab37a3bfdc7beb6198404d`);
// fs.saveToLs(
//   '/assets/test.pdf',
//   `https://gw.alipayobjects.com/os/bmw-prod/c134022a-1088-47e2-bb76-a33ec0519101.pdf?spm=a2c4g.11186623.0.0.cf863d1fUnQY0Y&file=c134022a-1088-47e2-bb76-a33ec0519101.pdf`,
// );
// fs.saveToLs('/assets/style/style.css', ` h1{ color: orange } `);
// fs.saveToLs('/assets/style/style.scss', ` h1{ div{ color: orange } } `);
// fs.saveToLs(
//   '/assets/test.mp4',
//   'http://vali-ugc.cp31.ott.cibntv.net/65747AA043C38717EFC8F38DD/03000A01005A5363D9CB5F514325B3E6018933-6359-951A-945C-0D482B330E2A.mp4?ccode=0512&duration=344&expire=18000&psid=ddcb0e89bc763682b2d7a62f00df7b1343346&ups_client_netip=cba8143c&ups_ts=1642870288&ups_userid=&utid=EERnGuQxfRwCAXBg6R9NG7%2Fh&vid=XMzMwMTYyODMyNA&vkey=B1f2f710f2f0204f0808685b0c8ee7608&eo=0&t=fd543f213638bcc&cug=1&type=mp4sd&bc=2&dre=u145&si=511&dst=1',
// );
// fs.saveToLs(
//   '/vue3.vue',
//   `<template>
//   <div>
//   <div class="test">
//   这是个渲染的Vue3.vue组件, 颜色绿
//   <h1>{{a}} ref: {{b}}</h1>
//   </div>
//   </div>
// </template>
// <script setup>
//   import { reative , ref} from 'vue'
//   const a = 123
//   const b = ref(1)
//   console.warn('vue3.vue setup running...')
// </script>
// <style scoped lang="scss">
//   div.test{
//   color: green
//   }
// </style>
//    `,
// );
// fs.saveToLs(
//   '/index.vue',
//   `<template>
//     <div style="text-align: center">
//       <img src="./assets/vue.png" style="width: 100px"/>
//       <h2>HELLO Vue in VIS-CODE-EDITOR</h2>
//       <Main />
//     </div>
//   </template>
//   <script>
//     import './a/b.js'
//     import Main from './vue3.vue'
//     console.error('exec index.vue script code')
//     console.warn(echarts)
//     export default {
//       components: { Main },
//       created() {
//         console.log('index.vue created !!!!')
//       },
//       mounted(){
//         console.log('index.vue mounted !!!!')
//       }
//     }
//   </script>
//   <style scoped lang="scss">
//     img{
//       margin: 20px
//     }
//     h2{
//       color: red
//     }
//   </style>
//    `,
// );
// fs.saveToLs(
//   '/material.json',
//   `
// {
//   name: "物料名称",
//   desc: "这是个描述",
//   dependencies: {
//     "jquery": "3.6.0",
//     "lodash": "2.7.14"
//   }
// }
// `,
// );
// loadZipFile('/test.zip', fs, () => {
//   fs.activeFile(fs.files['/index.vue']);
// });
export default fs;
