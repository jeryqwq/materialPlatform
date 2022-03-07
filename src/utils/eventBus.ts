class EventBus {
  _target: Record<string, Array<Function>>;
  constructor() {
    this._target = {};
  }
  on(name: string, fn: Function) {
    this._target[name]
      ? this._target[name].push(fn)
      : (this._target[name] = [fn]);
  }
  emit(name: string) {
    this._target[name] && this._target[name].forEach((i) => i && i());
  }
}
export default new EventBus();
