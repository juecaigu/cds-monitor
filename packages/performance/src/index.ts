import { Plugin } from '@cds-monitor/type';

class PerformancePlugin extends Plugin {
  type = 'performance';
  bindOptions(options: unknown): void {
    console.log('ooo', options);
  }
  core(): void {}
}

export default PerformancePlugin;
