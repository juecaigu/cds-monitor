import { EVENTTYPES } from '@cds-monitor/common'
import { ReplaceHandler, ReplaceCallback } from '@cds-monitor/type'
import { trycatch } from '@cds-monitor/utils'

// 订阅事件
const Subscribe = () => {
  const handlers: { [key in EVENTTYPES]?: ReplaceCallback[] } = {}
  const subscribe = (handler: ReplaceHandler): boolean => {
    if (!handler) {
      return false
    }
    handlers[handler.type] = handlers[handler.type] || []
    handlers[handler.type]?.push(handler.callback)
    return true
  }
  const unsubscribe = (type: EVENTTYPES) => {
    handlers[type] = undefined
  }
  const notify = (type: EVENTTYPES, data?: unknown): void => {
    if (!type || !handlers[type]) {
      return
    }
    handlers[type].forEach((callback) => {
      trycatch(
        () => {
          callback(data)
        },
        (error) => {
          if (console.warn) {
            console.warn(`notify ${callback} error:`, error)
          }
        }
      )
    })
  }
  return {
    subscribe,
    unsubscribe,
    notify
  }
}

export default Subscribe()
