import { SDK_VERSION } from '@cds-monitor/common';
import { InitOptions, ReportData } from '@cds-monitor/type';
import { ifExist, typeofValue, runtime, generateUUID } from '@cds-monitor/utils';

const sendLargeData = (data: ReportData) => {
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  return blob.size > 64 * 1024;
};

const _global = runtime.getGlobal();
const _support = runtime.getSupport();

const ReportData = () => {
  let dsn: string;
  let userId: string;
  let apiKey: string;
  // 判断请求是否为SDK配置的接口
  const isSdkTransportUrl = (targetUrl: string): boolean => {
    return ifExist(dsn) && targetUrl.indexOf(dsn) !== -1;
  };
  const transFormData = (data: ReportData): ReportData => {
    return {
      ...data,
      type: data.type,
      userId: userId,
      uuid: generateUUID(),
      pageUrl: '',
      sdkVersion: SDK_VERSION,
      apiKey: apiKey,
      deviceInfo: _support.deviceInfo as ReportData['deviceInfo'],
    };
  };
  let beforeDataReport:
    | ((data: ReportData) => Promise<ReportData | boolean> | ReportData)
    | undefined;
  const beforePost = async (data: ReportData): Promise<ReportData | boolean> => {
    let transportData = transFormData(data);
    if (ifExist(beforeDataReport) && typeofValue(beforeDataReport) === 'function') {
      const result = await beforeDataReport(data);
      if (result && typeof result !== 'boolean') {
        transportData = result;
      } else {
        return false;
      }
    }
    return transportData;
  };
  const beacon = (url: string, data: ReportData) => {
    if (_global.navigator && typeof _global.navigator.sendBeacon === 'function') {
      _global.navigator.sendBeacon(url, JSON.stringify(data));
    }
  };
  const fetchPost = (url: string, data: ReportData) => {
    if (_global.fetch && typeof _global.fetch === 'function') {
      _global.fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  };
  const send = async (data: ReportData) => {
    if (!ifExist(dsn)) {
      console.warn('dsn is required');
      return;
    }
    const result = await beforePost(data);
    if (result && typeof result !== 'boolean') {
      if (!sendLargeData(result)) {
        beacon(dsn, result);
      } else {
        fetchPost(dsn, result);
      }
    }
  };
  const bindOptions = (options: InitOptions) => {
    const { dsn: odsn, userId: ouserId, apikey: oapikey, beforeDataReport: obdr } = options;
    if (ifExist(odsn) && typeofValue(odsn) === 'string') {
      dsn = odsn;
    }
    if (ifExist(ouserId) && typeofValue(ouserId) === 'string') {
      userId = ouserId;
    }
    if (ifExist(oapikey) && typeofValue(oapikey) === 'string') {
      apiKey = oapikey;
    }
    if (ifExist(obdr) && typeofValue(obdr) === 'function') {
      beforeDataReport = obdr;
    }
  };
  return {
    send,
    bindOptions,
    isSdkTransportUrl,
  };
};

const reportData = ReportData();

export { reportData };
