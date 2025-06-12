const longTask = (callback: (long: PerformanceEntry[]) => void) => {
  const result: PerformanceEntry[] = [];
  const observer = new PerformanceObserver(list => {
    for (const long of list.getEntries()) {
      result.push(long);
      console.log('long', long);
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

export { longTask, getFCP, getFPS };
