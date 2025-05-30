import { Support } from "@cds-monitor/type";
import { UAParser } from "ua-parser-js";

const runtime = () => {
  const global = window; // simply for web and  otherwise can use nodejs \ wxapp \ ...
  const uaResult = new UAParser().getResult();
  const support: Support = {
    hasError: false, // 某段时间代码是否报错
    events: [], // 存储录屏的信息
    recordScreenId: "", // 本次录屏的id
    _loopTimer: 0, // 白屏循环检测的timer
    deviceInfo: {
      browserVersion: uaResult.browser.version, // // 浏览器版本号 107.0.0.0
      browser: uaResult.browser.name, // 浏览器类型 Chrome
      osVersion: uaResult.os.version, // 操作系统 电脑系统 10
      os: uaResult.os.name, // Windows
      ua: uaResult.ua,
      device: uaResult.device.model ? uaResult.device.model : "Unknow",
      device_type: uaResult.device.type ? uaResult.device.type : "Pc",
    },
  };
  return {
    getGlobal: () => {
      return global;
    },
    getSupport: () => {
      return support;
    },
  };
};

export default runtime();
