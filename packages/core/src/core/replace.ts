import { EVENTTYPES } from '@cds-monitor/common';
import { ReplaceHandler } from '@cds-monitor/type';
import subscribe from './subscribe';
import { bindEvent, runtime } from '@cds-monitor/utils';

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
    true
  );
};

const replace = (type: EVENTTYPES): void => {
  switch (type) {
    case EVENTTYPES.WHITESCREEN:
      whiteScreen();
      break;
    case EVENTTYPES.ERROR:
      listenError();
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
