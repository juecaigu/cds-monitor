import { Dpss } from './type';

const LIMIT_TIME = 10000; // 超过该时间认为页面完全加载，直接结束
const DELAY_TIME = 200; // 每次检查的间隔时间
const COMPLETE_TIME = 2000; // 当该时间段内没有dom新增，认为页面加载完成
const IGNORE_TAG_SET = ['SCRIPT', 'STYLE', 'META', 'HEAD', 'LINK'];
const TAG_WEIGHT = {
  SVG: 2,
  IMG: 2,
  CANVAS: 4,
  OBJECT: 4,
  EMBED: 4,
  VIDEO: 4,
};

const WW = window.innerWidth;
const WH = window.innerHeight;

function isInScreen(dom: Element): boolean {
  const rectInfo = dom.getBoundingClientRect();
  return rectInfo.left < WW && rectInfo.right > 0 && rectInfo.top < WH && rectInfo.bottom > 0;
}

const getStartTime = () => {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  return Date.now() - navigation.responseEnd;
};

const FMP = () => {
  let count = 0;
  let statusList: { time: number }[] = [];
  let observer: MutationObserver | null = null;
  let flag = true;
  let callback: (timing: number) => void;
  const checkCanceld = (time: number): boolean => {
    const t = Date.now() - time;
    let lastTime = 0;
    if (statusList?.length && statusList.length - 1 >= 0) {
      lastTime = statusList[statusList.length - 1].time;
    }
    return t > LIMIT_TIME || t - lastTime > COMPLETE_TIME;
  };
  // 给每个节点添加t_c属性，用于记录节点添加的时间
  const addTag = (target: Element, callbackCount: string) => {
    const tagName = target.tagName;
    if (!tagName || IGNORE_TAG_SET.includes(tagName)) {
      return;
    }
    if (!target.getAttribute('t_c')) {
      target.setAttribute('t_c', callbackCount);
    }
    const children = target.children;
    if (children.length > 0) {
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        addTag(child, callbackCount);
      }
    }
  };
  const initObserver = (START_TIME: number) => {
    observer = new MutationObserver(mutations => {
      const t = Date.now() - START_TIME;
      mutations.forEach(mutation => {
        const addedNodes = mutation.addedNodes;
        for (let i = 0; i < addedNodes.length; i++) {
          const node = addedNodes[i];
          if (node instanceof Element) {
            addTag(node, count.toString());
            count++;
            statusList.push({
              time: t,
            });
          }
        }
      });
    });
    observer?.observe(document.body, { childList: true, subtree: true });
  };
  const cancelObserver = () => {
    observer?.disconnect();
    observer = null;
    flag = false;
    statusList = [];
    count = 0;
  };

  const calAreaPercent = (target: DOMRect) => {
    const { left, right, top, bottom, width, height } = target;
    const wl = 0;
    const wt = 0;
    const wr = WW;
    const wb = WH;

    const overlapX = right - left + (wr - wl) - (Math.max(right, wr) - Math.min(left, wl));
    if (overlapX <= 0) {
      return 0;
    }

    const overlapY = bottom - top + (wb - wt) - (Math.max(bottom, wb) - Math.min(top, wt));
    if (overlapY <= 0) {
      return 0;
    }

    return (overlapX * overlapY) / (width * height);
  };

  const getWeight = (target: Element) => {
    let weight = TAG_WEIGHT[target.tagName as keyof typeof TAG_WEIGHT] || 1;
    if (weight === 1) {
      const style = window.getComputedStyle(target);
      if (
        style.backgroundImage &&
        style.backgroundImage !== 'none' &&
        style.backgroundImage !== 'initial'
      ) {
        weight = TAG_WEIGHT.IMG;
      }
    }
    return weight;
  };

  const calScore = (target: Element, dpss: Dpss[]) => {
    const targetRect = target.getBoundingClientRect();
    const { width, height } = targetRect;
    let f = 1;
    const weight = getWeight(target);
    let sdp = 0;
    dpss.forEach(dps => {
      sdp += dps.score;
    });
    if (!isInScreen(target)) {
      f = 0;
    }
    let score = width * height * weight * f;
    let els = [{ score, weight, node: target }];
    // 按照元素占位面积计算得分比例
    const areaPercent = calAreaPercent(targetRect);
    if (sdp > score * areaPercent || areaPercent === 0) {
      score = sdp;
      els = [];
      dpss.forEach(dps => {
        els = els.concat(dps.els);
      });
    }
    return {
      score,
      dpss,
      els,
    };
  };

  const deepTraverse = (target: Element): Dpss | null => {
    if (target?.tagName && !IGNORE_TAG_SET.includes(target.tagName)) {
      const children = target.children;
      const dpss: Dpss[] = [];
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const dps = deepTraverse(child);
        if (dps && dps.score) {
          dpss.push(dps);
        }
      }
      return calScore(target, dpss);
    }
    return null;
  };

  const filterTheResultSet = (els: Dpss['els']) => {
    let sum = 0;
    els.forEach(el => {
      sum += el.score;
    });
    const avg = sum / els.length;
    return els.filter(el => {
      return el.score >= avg;
    });
  };

  const calTiming = (set: Dpss['els']): number => {
    let rt = 0;
    set.forEach(item => {
      let t = 0;
      if (item.weight === 1) {
        const index = item.node.getAttribute('t_c');
        t = statusList[Number(index)]?.time;
      }
      if (rt < t) {
        rt = t;
      }
      item?.node.removeAttribute('t_c');
    });
    return rt;
  };

  const getHighestScore = (dpss: Dpss['dpss']): Dpss | null => {
    let tp: Dpss | null = null;
    dpss.forEach(dps => {
      if (tp && tp.score) {
        if (tp.score < dps.score) {
          tp = dps;
        }
      } else {
        tp = dps;
      }
    });
    return tp;
  };

  const calFinalScore = () => {
    const bodyTarget = document.body;
    const res = deepTraverse(bodyTarget);
    const highestScore = getHighestScore(res?.dpss || []);
    if (highestScore) {
      const els = filterTheResultSet((highestScore as Dpss).els || []);
      const timing = calTiming(els);
      callback(timing);
    }
  };

  const workLoop = (time: number) => {
    if (MutationObserver && flag) {
      const checkout = checkCanceld(time);
      if (checkout) {
        calFinalScore();
        cancelObserver();
      } else {
        setTimeout(() => {
          workLoop(time);
        }, DELAY_TIME);
      }
    }
  };

  const init = (cb: (timing: number) => void) => {
    const START_TIME = getStartTime();
    initObserver(START_TIME);
    workLoop(START_TIME);
    callback = cb;
  };

  return {
    init,
  };
};

const fmp = FMP();

export { fmp };
