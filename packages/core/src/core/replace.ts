import { EVENTTYPES } from '@cds-monitor/common';
import { Callback, ReplaceHandler } from '@cds-monitor/type';
import subscribe from './subscribe';
import { bindEvent, getLocationHref, replaceAop, runtime } from '@cds-monitor/utils';

const _global = runtime.getGlobal();

const whiteScreen = () => {
  subscribe.notify(EVENTTYPES.WHITESCREEN);
};

const listenError = () => {
  bindEvent(
    _global,
    'error',
    event => {
      event?.preventDefault();
      subscribe.notify(EVENTTYPES.ERROR, event);
    },
    true,
  );
};

const listenHistoryChange = (() => {
  let lastHref = getLocationHref();
  return () => {
    bindEvent(
      _global,
      'popstate',
      () => {
        const to = getLocationHref();
        const from = lastHref;
        lastHref = to;
        subscribe.notify(EVENTTYPES.HISTORY, {
          from,
          to,
        });
      },
      true,
    );
    const historyFnReplace: Callback = fn => {
      return function (this: unknown, ...args: unknown[]) {
        const to = getLocationHref();
        const from = lastHref;
        lastHref = to;
        subscribe.notify(EVENTTYPES.HISTORY, {
          from,
          to,
        });
        return (fn as (...args: unknown[]) => void).apply(this, args);
      };
    };
    // 增强replaceState和pushState
    replaceAop(_global.history, 'replaceState', historyFnReplace);
    replaceAop(_global.history, 'pushState', historyFnReplace);
  };
})();

const replace = (type: EVENTTYPES): void => {
  switch (type) {
    case EVENTTYPES.WHITESCREEN:
      whiteScreen();
      break;
    case EVENTTYPES.ERROR:
      listenError();
      break;
    case EVENTTYPES.HISTORY:
      listenHistoryChange();
      break;
    default:
      break;
  }
};

const replaceHalder = (handler: ReplaceHandler): void => {
  if (!subscribe.subscribe(handler)) return;
  replace(handler.type);
};

export { replaceHalder };
