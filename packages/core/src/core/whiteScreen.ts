// import { InitOptions, Callback } from "@cds-monitor/type";
// import { runtime } from "@cds-monitor/utils";
// import { STATUS_CODE } from "@cds-monitor/common";

const whiteScreen = () =>
  //   callBack: Callback,
  //   { skeletonProject, whiteBoxElements }: InitOptions
  {
    //   const _global = runtime.getGlobal();
    //   let _whiteLoopNum = 0;
    //   const _skeletonInitList: string[] = []; // 存储初次采样点
    //   let _skeletonNowList: string[] = []; // 存储当前采样点
    //   const isContainer = () => {};
    //   const ric = (fn: () => void) => {
    //     if ("requestIdleCallback" in _global) {
    //       _global.requestIdleCallback((overTime) => {
    //         if (overTime.timeRemaining() > 0) {
    //           fn();
    //         }
    //       });
    //     } else {
    //       fn();
    //     }
    //   };
    //   const sampling = () => {
    //     let emptyNum = 0;
    //     const h = _global.innerHeight;
    //     const w = _global.innerWidth;
    //     // 交叉采样
    //     for (let i = 0; i < 9; i++) {
    //       const x = document.elementsFromPoint((w * i) / 10, h / 2);
    //       const y = document.elementsFromPoint(w / 2, (h * i) / 10);
    //       if (isContainer(x)) {
    //         emptyNum++;
    //       }
    //       if (isContainer(y)) {
    //         emptyNum++;
    //       }
    //     }
    //     callBack({ status: emptyNum === 17 ? STATUS_CODE.ERROR : STATUS_CODE.OK });
    //   };
  };

export { whiteScreen };
