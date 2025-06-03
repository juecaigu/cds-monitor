import { InitOptions } from '@cds-monitor/type'
import { handleOptions, setup } from './core'

/**
 * 加载插件
 * @param plugins 插件列表
 */
const use = (plugins: []) => {
  if (!Array.isArray(plugins)) {
    console.warn('plugins must be an array')
  }
}

const init = (options: InitOptions) => {
  // 初始化options配置
  handleOptions(options)
  // 执行核心逻辑
  setup()
}

export { init, use }
