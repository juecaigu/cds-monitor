import { fmp } from './fmp';
import { MPerformanceNavigationTiming } from './type';

const longTask = (callback: (long: PerformanceEntry[]) => void) => {
  const result: PerformanceEntry[] = [];
  const observer = new PerformanceObserver(list => {
    for (const long of list.getEntries()) {
      result.push(long);
    }
    callback(result);
  });
  observer.observe({ entryTypes: ['longtask'] });
};

const getFCP = (callback: (fcp: PerformanceEntry) => void) => {
  const entryHandler = (list: PerformanceObserverEntryList) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        observer.disconnect();
      }
      callback(entry);
    }
  };

  const observer = new PerformanceObserver(entryHandler);
  observer.observe({ type: 'paint', buffered: true });
};

const getFPS = (callback: (fps: number) => void) => {
  let lastTime = performance.now();
  let frame = 0;
  let lastFameTime = performance.now();
  const loop = function () {
    const now = performance.now();
    const fs = now - lastFameTime;
    lastFameTime = now;
    let fps = Math.round(1000 / fs);
    frame++;
    if (now > 1000 + lastTime) {
      fps = Math.round((frame * 1000) / (now - lastTime));
      frame = 0;
      lastTime = now;
      callback(fps);
    }
    window.requestAnimationFrame(loop);
  };
  loop();
};

// 获取 NT
const getNavigationTiming = (): MPerformanceNavigationTiming | undefined => {
  const resolveNavigationTiming = (
    entry: PerformanceNavigationTiming,
  ): MPerformanceNavigationTiming => {
    const {
      domainLookupStart,
      domainLookupEnd,
      connectStart,
      connectEnd,
      secureConnectionStart,
      requestStart,
      responseStart,
      responseEnd,
      domInteractive,
      domContentLoadedEventEnd,
      loadEventStart,
      fetchStart,
    } = entry;

    return {
      // 关键时间点
      FP: responseEnd - fetchStart,
      TTI: domInteractive - fetchStart,
      DomReady: domContentLoadedEventEnd - fetchStart,
      Load: loadEventStart - fetchStart,
      FirstByte: responseStart - domainLookupStart,
      // 关键时间段
      DNS: domainLookupEnd - domainLookupStart,
      TCP: connectEnd - connectStart,
      SSL: secureConnectionStart ? connectEnd - secureConnectionStart : 0,
      TTFB: responseStart - requestStart,
      Trans: responseEnd - responseStart,
      DomParse: domInteractive - responseEnd,
      Res: loadEventStart - domContentLoadedEventEnd,
    };
  };

  const navigation =
    performance.getEntriesByType('navigation').length > 0
      ? performance.getEntriesByType('navigation')[0]
      : performance.timing; // W3C Level1  (目前兼容性高，仍然可使用，未来可能被废弃)。
  return resolveNavigationTiming(navigation as PerformanceNavigationTiming);
};

const getFMP = (cb: (timing: number) => void) => {
  fmp.init(cb);
};

export { longTask, getFCP, getFPS, getNavigationTiming, getFMP };
