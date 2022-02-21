export default class ProxySandbox {
  sandboxRunning: boolean = false;
  proxy: Record<string, any>;
  addValue: Record<string, any>;
  active() {
    this.sandboxRunning = true;
  }
  inactive() {
    this.sandboxRunning = false;
  }
  constructor() {
    this.addValue = {};
    const rawWindow: Record<string | symbol, any> = window;
    const fakeWindow: Record<string | symbol, any> = {};
    const that = this;
    const proxy = new Proxy(fakeWindow, {
      get(target, prop) {
        console.log('get', prop);
        return prop in target ? target[prop] : rawWindow[prop];
      },
      set(target, prop, value) {
        console.log('set', prop);
        if (that.sandboxRunning) {
          fakeWindow[prop] = value;
          that.addValue[prop as string] = value;
          return true;
        }
        return false;
      },
    });
    this.proxy = proxy;
  }
}
