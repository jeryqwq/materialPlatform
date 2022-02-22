import { observable, action, makeAutoObservable } from 'mobx';

class Dependencies {
  @observable dependencies: Record<string, Library> = {};
  constructor() {
    makeAutoObservable(this);
  }
  @action addDep(name: string, value: Library) {
    this.dependencies[name] = value;
  }
  @action resetDep() {
    this.dependencies = {};
  }
  @action getDep(name: string) {
    return this.dependencies[name];
  }
  @action loadedDep(name: string) {
    this.dependencies[name] && (this.dependencies[name].loaded = true);
  }
  @action removeDep(name: string) {
    delete this.dependencies[name];
    // todo remove script && sandobox window varible
  }
}
const dep = new Dependencies();
export default dep;
