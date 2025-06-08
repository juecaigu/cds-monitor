import { InitOptions } from '@cds-monitor/type';
import { handleOptions, setup } from './core';
import { reportData } from './core/reportData';
import { recordTime } from './core/recordTime';

/**
 * 加载插件
 * @param plugins 插件列表
 */
const use = (plugins: []) => {
  if (!Array.isArray(plugins)) {
    console.warn('plugins must be an array');
  }
};

const init = (options: InitOptions) => {
  // 初始化options配置
  handleOptions(options);
  reportData.bindOptions(options);
  recordTime.initTime(options.serverTime);
  // 执行核心逻辑
  setup();
};

export { init, use };
