import { InitOptions, Callback } from "@cds-monitor/type";
import { runtime } from "@cds-monitor/utils";
import { STATUS_CODE } from "@cds-monitor/common";

const whiteScreen = (
  callBack: Callback,
  { whiteBoxElements }: InitOptions
): void => {
  const _global = runtime.getGlobal();
  const maxEmptyTimes = 3; // 最大白屏次数
  let whiteScreenNum: number = 0;
  let timer: NodeJS.Timeout | number | null = null;
  const getSelector = (element: Element | null): string => {
    if (!element) {
      return "";
    }
    if (element.id) {
      return "#" + element.id;
    } else if (element.className) {
      // div home => div.home
      return (
        "." +
        element.className
          .split(" ")
          .filter((item) => !!item)
          .join(".")
      );
    } else {
      return element.nodeName.toLowerCase();
    }
  };
  const isContainer = (element: Element | null): boolean => {
    const selector = getSelector(element);
    return whiteBoxElements?.indexOf(selector) != -1;
  };
  const ric = (fn: () => void, ricCallback?: (args?: unknown) => unknown) => {
    if ("requestIdleCallback" in _global) {
      _global.requestIdleCallback(() => {
        const r = fn();
        if (ricCallback) {
          ricCallback(r);
        }
      });
    } else {
      setTimeout(() => {
        const r = fn();
        if (ricCallback) {
          ricCallback(r);
        }
      }, 1); //保证在主线程空闲时执行，避免阻塞主线程
    }
  };
  const sampling = () => {
    let emptyNum = 0;
    const h = _global.innerHeight;
    const w = _global.innerWidth;
    // 垂直采样
    for (let i = 0; i < 9; i++) {
      const x = document.elementFromPoint((w * i) / 10, h / 2);
      const y = document.elementFromPoint(w / 2, (h * i) / 10);
      if (isContainer(x)) {
        emptyNum++;
      }
      if (isContainer(y) && i !== 5) {
        emptyNum++;
      }
    }
    return emptyNum === 17;
  };
  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };
  const run = () => {
    timer = setInterval(() => {
      ric(sampling, (samplingResult) => {
        if (samplingResult) {
          if (whiteScreenNum >= maxEmptyTimes - 1) {
            callBack({ status: STATUS_CODE.ERROR });
            stop(); // 停止定时器
          }
          whiteScreenNum++;
        } else {
          whiteScreenNum = 0; // 重置 lastWhiteScreenTime 为 null
        }
      });
    }, 1000);
  };

  run();
};

export { whiteScreen };
