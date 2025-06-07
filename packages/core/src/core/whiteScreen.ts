import { InitOptions, Callback } from '@cds-monitor/type'
import { runtime } from '@cds-monitor/utils'
import { STATUS_CODE } from '@cds-monitor/common'

interface WhiteScreenConfig {
  maxEmptyTimes: number
  samplingInterval: number
  samplingPoints: number
}

const DEFAULT_CONFIG: WhiteScreenConfig = {
  maxEmptyTimes: 3,
  samplingInterval: 1000,
  samplingPoints: 9
}

const whiteScreen = (
  callback: Callback,
  { whiteBoxElements = [] }: InitOptions
): (() => void) => {
  const _global = runtime.getGlobal()
  let whiteScreenCount = 0
  let timer: NodeJS.Timeout | null = null

  const getSelector = (element: Element | null): string => {
    if (!element) return ''

    if (element.id) {
      return `#${element.id}`
    }

    if (element.className) {
      return `.${element.className.split(' ').filter(Boolean).join('.')}`
    }

    return element.nodeName.toLowerCase()
  }

  const isContainer = (element: Element | null): boolean => {
    if (!element || !whiteBoxElements) return false
    const selector = getSelector(element)
    return whiteBoxElements.includes(selector)
  }

  const requestIdleCallback = (fn: () => void): void => {
    if ('requestIdleCallback' in _global) {
      _global.requestIdleCallback(fn)
    } else {
      setTimeout(fn, 1)
    }
  }

  const sampling = (): boolean => {
    const height = _global.innerHeight
    const width = _global.innerWidth
    let emptyPoints = 0
    const totalPoints = DEFAULT_CONFIG.samplingPoints

    // 优化采样算法：使用Map来缓存已检查过的点，避免重复计算
    const checkedPoints = new Map<string, boolean>()

    for (let i = 0; i < totalPoints; i++) {
      // 水平采样点
      const horizontalPoint = document.elementFromPoint(
        (width * i) / (totalPoints - 1),
        height / 2
      )
      const horizontalKey = `h-${i}`
      if (!checkedPoints.has(horizontalKey)) {
        checkedPoints.set(horizontalKey, isContainer(horizontalPoint))
        if (checkedPoints.get(horizontalKey)) emptyPoints++
      }

      // 垂直采样点
      const verticalPoint = document.elementFromPoint(
        width / 2,
        (height * i) / (totalPoints - 1)
      )
      const verticalKey = `v-${i}`
      if (
        !checkedPoints.has(verticalKey) &&
        i !== Math.floor(totalPoints / 2)
      ) {
        checkedPoints.set(verticalKey, isContainer(verticalPoint))
        if (checkedPoints.get(verticalKey)) emptyPoints++
      }
    }

    return emptyPoints >= (totalPoints * 2 - 1) * 0.95 // 95%以上采样点为空认为是白屏
  }

  const stop = (): void => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  const run = (): void => {
    timer = setInterval(() => {
      requestIdleCallback(() => {
        const isWhiteScreen = sampling()

        if (isWhiteScreen) {
          whiteScreenCount++
          if (whiteScreenCount >= DEFAULT_CONFIG.maxEmptyTimes) {
            callback({ status: STATUS_CODE.ERROR })
            stop()
          }
        } else {
          whiteScreenCount = 0
        }
      })
    }, DEFAULT_CONFIG.samplingInterval)
  }

  run()

  return stop
}

export { whiteScreen }
