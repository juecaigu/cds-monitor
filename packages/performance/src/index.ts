import { Plugin, SdkPluginCore } from '@cds-monitor/type';
import { RecordType } from './type';

class PerformancePlugin extends Plugin {
  type = 'performance';
  options: RecordType = {};
  bindOptions(options: unknown): void {
    this.options = options as RecordType;
  }
  core(sdk: SdkPluginCore): void {
    console.log('123456', sdk);
    const observer = new PerformanceObserver(list => {
      console.log('list', list);
      for (const long of list.getEntries()) {
        console.log('long', long);
      }
    });
    observer.observe({ entryTypes: ['longtask'] });
  }
}

export default PerformancePlugin;
