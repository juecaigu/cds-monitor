import { InitOptions } from '@cds-monitor/type';

type ServerTime = InitOptions['serverTime'];

const RecordTime = () => {
  let time: number;
  let exectTime: number;
  const nowTime = () => {
    return new Date().getTime();
  };
  const initTime = (t?: ServerTime) => {
    if (typeof t === 'function') {
      t().then(res => {
        time = res;
        exectTime = res - nowTime();
      });
    } else {
      time = t || nowTime();
      exectTime = time - nowTime();
    }
  };
  const getTime = () => {
    return nowTime() + exectTime;
  };

  return {
    initTime,
    getTime,
  };
};

const recordTime = RecordTime();

export { recordTime };
