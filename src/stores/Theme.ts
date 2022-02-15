import { ProSettings } from '@ant-design/pro-layout';
import { observable, action, makeAutoObservable } from 'mobx';

class ThemeConfig {
  @observable themeConfig: Partial<ProSettings>;
  constructor() {
    makeAutoObservable(this);
    this.themeConfig = { fixSiderbar: true, navTheme: 'light' };
  }
  @action setTheme = (config: ProSettings) => {
    this.themeConfig = config;
  };
}

export default new ThemeConfig();
