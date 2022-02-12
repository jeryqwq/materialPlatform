import { observable, action, makeAutoObservable } from 'mobx';

class Dependencies {
  @observable dependencies: Record<string, Library> = {};
  constructor() {
    makeAutoObservable(this);
  }
  @action addDep(name: string, value: string) {}
  @action getDep(name: string) {}
  @action async loadDepList(perfix: string) {}
}
const dep = new Dependencies();
export default dep;
