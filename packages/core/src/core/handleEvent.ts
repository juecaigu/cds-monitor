import { options } from './options';
import { whiteScreen } from './whiteScreen';
import { ErrorTarget } from '@cds-monitor/type';
import { typeofValue } from '@cds-monitor/utils';
import { parseStackFrames } from './parseStackFrames';

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
      console.log('123456', error);
      const stackFrames = parseStackFrames(error.error as Error);
      console.log('stackFrames', stackFrames);
    }
    // load source error
    if (errorType === 'event') {
      console.log('22222', error);
    }
  },
};

export { HandleEvent };
