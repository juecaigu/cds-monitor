import { Plugin, SdkPluginCore } from '@cds-monitor/type';
import { RecordType } from './type';
import { getFCP, longTask, getFPS, getNavigationTiming, getFMP } from './performance';

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
    getFMP(timing => {
      console.log('fmp', timing);
    });
    // 这段代码需要注册到开始加载脚本中
    window.addEventListener('load', () => {
      if (document.readyState === 'complete') {
        console.log('getNavigationTiming', getNavigationTiming());
      }
    });
  }
}

export default PerformancePlugin;
