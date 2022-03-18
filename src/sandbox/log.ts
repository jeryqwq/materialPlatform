import { CONSOLE_TYPES } from '@/contants/render';

const prevConsole = { ...window.console };
const logMap = {
  error: CONSOLE_TYPES.ERROR,
  wran: CONSOLE_TYPES.WARN,
  log: CONSOLE_TYPES.USER,
};
export const batchConsole = function (
  rewriteFn: (_: { type: symbol; text: Array<any> }) => void,
) {
  Object.keys(logMap).forEach((i) => {
    window.console[i as 'log'] = (...args) => {
      prevConsole[i as 'log'](...args);
      rewriteFn({ type: logMap[i as 'log'], text: args });
    };
  });
};
export const freeConsole = function () {
  Object.keys(logMap).forEach((i) => {
    window.console[i as 'log'] = prevConsole[i as 'log'];
  });
};
