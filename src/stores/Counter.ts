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

export default new Counter();
