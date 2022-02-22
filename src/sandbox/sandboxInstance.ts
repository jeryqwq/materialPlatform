import ProxySandbox from './index';
const renderSandbox = new ProxySandbox();
declare global {
  interface Window {
    __RENDER_SANDBOX: any;
  }
}

window.__RENDER_SANDBOX = renderSandbox;

export default {
  renderSandbox,
};
