import { ErrorTarget, RouteHistory } from '@cds-monitor/type';
import { HandleEvent } from './handleEvent';
import { replaceHalder } from './replace';
import { EVENTTYPES } from '@cds-monitor/common';

export const setup = (): void => {
  // call setup replace some functions and properties
  replaceHalder({
    type: EVENTTYPES.WHITESCREEN,
    callback: () => {
      HandleEvent.hanleWhiteScreen();
    },
  });
  replaceHalder({
    type: EVENTTYPES.ERROR,
    callback: error => {
      HandleEvent.handleError(error as ErrorTarget);
    },
  });
  // 监听history模式路由的变化
  replaceHalder({
    type: EVENTTYPES.HISTORY,
    callback: data => {
      HandleEvent.handleHistory(data as RouteHistory);
    },
  });
};
