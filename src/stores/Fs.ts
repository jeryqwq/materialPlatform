import { observable, action, makeAutoObservable } from 'mobx';

let dbConnect =  window.indexedDB.open('FileEditor', 1)
class FileSystem {
  @observable  files = {};

  constructor () {
    dbConnect.onerror = function(event) {
      alert("Why didn't you allow app to use IndexedDB?!");
    };
    dbConnect.onsuccess = function(event: any) {
      // dbConnect = event.target.result
    }
    dbConnect.onupgradeneeded = function(event: any) {
      alert(1)
      const db = event.target.result
      var objectStore = db.createObjectStore("customers", { keyPath: "ssn" });
      console.log(objectStore)
    }
  }
  @action saveToDb () { // 数据写入indexDB, 只有ctrl + s 的时候才会保存的db， onchange参数写入内存，没必要每次都保存到硬盘， 做持久化存储

  }
}

export default new FileSystem();
