import { observable, action, makeAutoObservable } from 'mobx';

class Counter {
  @observable count = 0;
  constructor() {
    makeAutoObservable(this);
  }
  @action handleInc = () => {
    this.count++;
  };

  @action handleDec = () => {
    this.count--;
  };
}
const counter = new Counter();
export default counter;
