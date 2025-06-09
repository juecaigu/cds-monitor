import { options } from './options';
import { whiteScreen } from './whiteScreen';
import { ErrorTarget, ViewModel } from '@cds-monitor/type';
import { typeofValue, getErrorUid, errorHashMap } from '@cds-monitor/utils';
import { parseStackFrames } from './parseStackFrames';
import { reportData } from './reportData';
import { EVENTTYPES } from '@cds-monitor/common';
import { parseComponentName } from './parseComponentName';

const HandleEvent = {
  hanleWhiteScreen() {
    whiteScreen(() => {
      // report whiteScreen error
    }, options);
  },
  handleError(error: ErrorTarget) {
    const errorType = typeofValue(error);
    // javescript error
    if (errorType === 'errorevent') {
      const errorTarget = (error.error || error) as Error;
      const stackFrames = parseStackFrames(errorTarget);
      reportData.send({
        type: EVENTTYPES.ERROR,
        stack: stackFrames,
      });
      console.log('errorevent', stackFrames);
    }
    // load source error
    if (errorType === 'event') {
      console.log('load source error', error);
    }
  },
  handleVueError(error: Error, vm: ViewModel, info: string) {
    const component = parseComponentName(vm, true);
    const errorUid = getErrorUid(`${EVENTTYPES.VUE}-${error.message}-${info}`);
    if (!errorHashMap.hashExist(errorUid)) {
      reportData.send({
        type: EVENTTYPES.VUE,
        message: error.message,
        meta: {
          componentName: component,
          hook: info,
        },
      });
    }
  },
};

export { HandleEvent };
