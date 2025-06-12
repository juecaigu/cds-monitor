import { Plugin, SdkPluginCore } from '@cds-monitor/type';
import { RecordType } from './type';
import { getFCP, longTask, getFPS } from './performance';

class PerformancePlugin extends Plugin {
  type = 'performance';
  options: RecordType = {};
  bindOptions(options: unknown): void {
    this.options = options as RecordType;
  }
  core(sdk: SdkPluginCore): void {
    longTask(list => {
      console.log('long', list, sdk);
    });
    getFCP(entry => {
      console.log('fcp', entry);
    });
    getFPS(fps => {
      console.log('fps', fps);
    });
  }
}

export default PerformancePlugin;
