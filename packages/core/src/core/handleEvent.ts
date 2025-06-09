import { options } from './options';
import { whiteScreen } from './whiteScreen';
import { ErrorTarget } from '@cds-monitor/type';
import { typeofValue } from '@cds-monitor/utils';
import { parseStackFrames } from './parseStackFrames';
import { reportData } from './reportData';
import { EVENTTYPES } from '@cds-monitor/common';

const HandleEvent = {
  hanleWhiteScreen() {
    whiteScreen(() => {
      // report whiteScreen error
    }, options);
  },
  handleError(error: ErrorTarget) {
    const errorType = typeofValue(error);
    // javescript error
    if (errorType === 'errorevent' || errorType === 'error') {
      const errorTarget = (error.error || error) as Error;
      console.log('errorTarget', error);
      const stackFrames = parseStackFrames(errorTarget);
      reportData.send({
        type: EVENTTYPES.ERROR,
        stack: stackFrames,
      });
      console.log('stackFrames', stackFrames);
    }
    // load source error
    if (errorType === 'event') {
      console.log('load source error', error);
    }
  },
};

export { HandleEvent };
