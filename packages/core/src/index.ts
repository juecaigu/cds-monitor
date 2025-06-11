import { InitOptions, ViewModel, VueInstance, PluginConstructor } from '@cds-monitor/type';
import { handleOptions, setup, options } from './core';
import { reportData } from './core/reportData';
import { recordTime } from './core/recordTime';
import { HandleEvent } from './core/handleEvent';
import { ifExist, trycatch, typeofValue } from '@cds-monitor/utils';

/**
 * 加载插件
 * @param plugins 插件列表
 */
const use = (plugins: { plugin: PluginConstructor; options?: unknown }[]) => {
  if (!Array.isArray(plugins)) {
    console.warn('plugins must be an array');
  }
  for (const { plugin: pluginClass, options: pluginOption } of plugins) {
    const plugin = new pluginClass();
    trycatch(() => {
      if (plugin?.bindOptions) {
        plugin.bindOptions(pluginOption);
      }
      if (!ifExist(plugin.core) || typeofValue(plugin.core) !== 'function') {
        console.warn(`${plugin.type} is not a valid plugin`);
        return;
      }
      plugin.core({
        getTime: recordTime.getTime,
        send: reportData.send,
        options: options,
        breadcrumbs: [],
      });
    });
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

const install = (app: VueInstance, options: InitOptions) => {
  const handler = app.config.errorHandler;
  // vue项目在Vue.config.errorHandler中上报错误
  app.config.errorHandler = function (err: Error, vm: ViewModel, info: string): void {
    HandleEvent.handleVueError(err, vm, info);
    if (handler) handler.apply(null, [err, vm, info]);
  };
  init(options);
};

export default { install, use, init };
