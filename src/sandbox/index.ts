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
    // js sandbox
    // https://stackoverflow.com/questions/10743596/why-are-certain-function-calls-termed-illegal-invocations-in-javascript
    // VM73:3 Uncaught TypeError: Illegal invocation
    fakeWindow.document = window.document;
    fakeWindow.setTimeout = window.setTimeout.bind(window);
    const that = this;
    const proxy = new Proxy(fakeWindow, {
      get(target, prop) {
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
